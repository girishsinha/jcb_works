from django.http import JsonResponse
from rest_framework import mixins, viewsets, filters, generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser, SAFE_METHODS
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth import get_user_model

from .models import (
    UserActivityLog,
    Machine,
    Operator,
    WorkRecord,
    MaintenanceRecord,
    WorkEntry,
    OperatorSalary
)
from .serializers import (
    MachineSerializer,
    OperatorSerializer,
    WorkRecordSerializer,
    MaintenanceRecordSerializer,
    WorkEntrySerializer,
    OperatorSalarySerializer,
    ReadOnlyWorkEntrySerializer,
    ReadOnlyMaintenanceRecordSerializer,
    UserActivityLogSerializer,
    UserRegistrationSerializer
)
from .permission import IsOwnerAdmin, IsStaffLevel, IsEmployeeOperator, IsOwnerOrStaff

User = get_user_model()

def test_api(request):
    return JsonResponse({"message": "Hello from Django!"})


# User Registration API
class UserRegistrationAPIView(CreateAPIView):
    serializer_class = UserRegistrationSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated, IsOwnerAdmin]


# Get Logged-in User Info
class UserInfoAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        groups = user.groups.values_list('name', flat=True)
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "groups": list(groups),
        })


# Machine ViewSet with logging on update and delete
class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        reason = self.request.data.get('reason')
        if not reason:
            raise PermissionDenied("Reason for deletion must be provided.")

        UserActivityLog.objects.create(
            user=self.request.user,
            action="DELETED",
            model_name="Machine",
            object_id=instance.id,
            description=f"Deleted machine: {instance.machine_number} (Reason: {reason})"
        )
        instance.delete()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        UserActivityLog.objects.create(
            user=request.user,
            action="UPDATED",
            model_name="Machine",
            object_id=instance.id,
            description=f"Updated machine: {instance.machine_number}"
        )

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


# Operator ViewSet with optional logging (can add create/update/delete logs as needed)
class OperatorViewSet(viewsets.ModelViewSet):
    queryset = Operator.objects.all()
    serializer_class = OperatorSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]


# Operator Salary ViewSet
class OperatorSalaryViewSet(viewsets.ModelViewSet):
    serializer_class = OperatorSalarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        operator = self.request.query_params.get('operator')
        year = self.request.query_params.get('year')
        queryset = OperatorSalary.objects.all()
        if operator and year:
            queryset = queryset.filter(operator_id=operator, year=year)
        return queryset


# Work Record ViewSet with filters
class WorkRecordViewSet(viewsets.ModelViewSet):
    queryset = WorkRecord.objects.all()
    serializer_class = WorkRecordSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['start_date']
    ordering = ['-start_date']

    def get_queryset(self):
        queryset = WorkRecord.objects.all()
        machine = self.request.query_params.get('machine')
        status = self.request.query_params.get('payment_status')
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')
        search = self.request.GET.get('search')

        if machine:
            queryset = queryset.filter(machine_id=machine)
        if status:
            queryset = queryset.filter(payment_status=status)
        if year and month:
            queryset = queryset.filter(start_date__year=year, start_date__month=month)
        elif year:
            queryset = queryset.filter(start_date__year=year)
        if search:
            queryset = queryset.filter(Q(client_name__icontains=search))
        return queryset


# MaintenanceRecord ViewSet (readonly for operators)
class MaintenanceRecordViewSet(mixins.ListModelMixin,
                               mixins.RetrieveModelMixin,
                               viewsets.GenericViewSet):
    queryset = MaintenanceRecord.objects.all().order_by('-maintenance_date')
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        user = self.request.user
        if user.groups.filter(name='Level_3_Employee_operator').exists():
            return ReadOnlyMaintenanceRecordSerializer
        return MaintenanceRecordSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        machine_id = self.request.query_params.get('machine_id')
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')

        if machine_id:
            queryset = queryset.filter(machine__id=machine_id)
        if month:
            queryset = queryset.filter(maintenance_date__month=month)
        if year:
            queryset = queryset.filter(maintenance_date__year=year)

        return queryset.order_by('maintenance_date')


# Maintenance Create/Update APIView with restriction for Level 3 users
class MaintenanceRecordCreateUpdateAPIView(generics.CreateAPIView, generics.UpdateAPIView):
    queryset = MaintenanceRecord.objects.all()
    serializer_class = MaintenanceRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        user = self.request.user
        if user.groups.filter(name='Level_3_Employee_operator').exists():
            raise PermissionDenied("Level 3 users cannot create or update maintenance records.")
        return MaintenanceRecordSerializer


# WorkEntry creation API with role-based serializer
class WorkEntryCreateAPIView(generics.CreateAPIView):
    queryset = WorkEntry.objects.all()
    serializer_class = WorkEntrySerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]

    def get_serializer_class(self):
        user = self.request.user
        if user.groups.filter(name='Level_3_Employee_operator').exists():
            return ReadOnlyWorkEntrySerializer
        return WorkEntrySerializer


# JWT Custom Token View with extra user info
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data['user'] = {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        }
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# ViewSet for reading User Activity Logs
class UserActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserActivityLog.objects.all().order_by('-timestamp')
    serializer_class = UserActivityLogSerializer
    permission_classes = [IsAuthenticated, IsOwnerAdmin]
