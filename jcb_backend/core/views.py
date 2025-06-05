from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAdminUser

from .models import Machine, Operator, WorkRecord, MaintenanceRecord, WorkEntry, OperatorSalary 
from .serializers import MachineSerializer, OperatorSerializer, WorkRecordSerializer, MaintenanceRecordSerializer, WorkEntrySerializer, OperatorSalarySerializer
from django.utils.timezone import now
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
import datetime
from django.db.models.functions import TruncMonth
from calendar import monthrange
from datetime import timedelta


# Test API (optional, but helpful for testing)
def test_api(request):
    return JsonResponse({"message": "Hello from Django!"})

# ViewSets for DRF
class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer

class OperatorViewSet(viewsets.ModelViewSet):
    queryset = Operator.objects.all()
    serializer_class = OperatorSerializer
    permission_classes = [IsAuthenticated]

class OperatorSalaryViewSet(viewsets.ModelViewSet):
    #queryset = OperatorSalary.objects.all()
    serializer_class = OperatorSalarySerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        operator = self.request.query_params.get('operator')
        year = self.request.query_params.get('year')
        queryset = OperatorSalary.objects.all()
        if operator and year:
            queryset = queryset.filter(operator_id=operator, year=year)
        return queryset

class WorkRecordViewSet(viewsets.ModelViewSet):
    queryset = WorkRecord.objects.all()
    serializer_class = WorkRecordSerializer
    
    def get_queryset(self):
        queryset = WorkRecord.objects.all()
        machine = self.request.query_params.get('machine')
        status = self.request.query_params.get('payment_status')
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')

        if not any([machine, status, month, year]):
            return queryset.none()  # show nothing if no filter

        if machine:
            queryset = queryset.filter(machine__machine_number=machine)
        if status:
            queryset = queryset.filter(payment_status=status)
        if month and year:
            queryset = queryset.filter(start_date__month=month, start_date__year=year)
        elif year:
            queryset = queryset.filter(start_date__year=year)

        return queryset.order_by('start_date')

    


@api_view(['GET'])
def yearly_working_hours(request):
    try:
        current_year = datetime.date.today().year
        data = WorkRecord.objects.filter(start_date__year=current_year)\
            .annotate(month=TruncMonth('start_date'))\
            .values('month', 'machine__machine_number')\
            .annotate(total_hours=Sum('total_hours'))\
            .order_by('month')

        return Response(data)

    except Exception as e:
        print("❌ ERROR in yearly_working_hours:", str(e))
        return Response({"error": str(e)}, status=500)    


@api_view(['GET'])
def monthly_diesel_usage(request):
    # Get selected month and year from query parameters or use current
    month = int(request.GET.get('month', now().month))
    year = int(request.GET.get('year', now().year))

    # Get total days in selected month
    days_in_month = monthrange(year, month)[1]

    # Initialize result dictionary for each day of the month
    result = {day: {} for day in range(1, days_in_month + 1)}

    # Fetch records that may overlap the selected month
    records = WorkRecord.objects.filter(
        start_date__lte=f'{year}-{month:02d}-{days_in_month}',
        end_date__gte=f'{year}-{month:02d}-01'
    )

    for record in records:
        jcb = record.machine.machine_number
        total_days = (record.end_date - record.start_date).days + 1
        daily_avg = record.diesel_used / total_days if total_days > 0 else 0

        current_date = record.start_date
        while current_date <= record.end_date:
            if current_date.month == month and current_date.year == year:
                day = current_date.day
                if jcb not in result[day]:
                    result[day][jcb] = 0
                result[day][jcb] += round(daily_avg, 2)  # round for better display
            current_date += timedelta(days=1)

    return Response(result)


# views.py
class MaintenanceRecordViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceRecord.objects.all().order_by('-maintenance_date')
    serializer_class = MaintenanceRecordSerializer

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



class WorkEntryCreateAPIView(generics.CreateAPIView):
    queryset = WorkEntry.objects.all()
    serializer_class = WorkEntrySerializer