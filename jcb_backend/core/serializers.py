from rest_framework import serializers
from .models import (
    Machine,
    Operator,
    WorkRecord,
    MaintenanceRecord,
    WorkEntry,
    OperatorSalary,
    UserActivityLog
)
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

# Get the custom user model
User = get_user_model()

# Serializer for user registration from Admin panel
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'authority_level']

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            authority_level=validated_data.get('authority_level', 3),  # <-- this line is crucial
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


# Serializer for Machine model
class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = '__all__'

# Serializer for Operator model
class OperatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Operator
        fields = '__all__'

# Serializer for Operator Salary model with calculated fields
class OperatorSalarySerializer(serializers.ModelSerializer):
    total_salary = serializers.ReadOnlyField()
    remaining_salary = serializers.ReadOnlyField()
    status = serializers.ReadOnlyField()

    class Meta:
        model = OperatorSalary
        fields = '__all__'

# Serializer for Work Record with custom formatted fields
class WorkRecordSerializer(serializers.ModelSerializer):
    machine_details = serializers.SerializerMethodField()
    start_date = serializers.SerializerMethodField()
    end_date = serializers.SerializerMethodField()

    class Meta:
        model = WorkRecord
        fields = '__all__'

    def get_machine_details(self, obj):
        return {
            "machine_number": obj.machine.machine_number
        } if obj.machine else None

    def get_start_date(self, obj):
        return obj.start_date.strftime('%d-%m-%Y') if obj.start_date else None

    def get_end_date(self, obj):
        return obj.end_date.strftime('%d-%m-%Y') if obj.end_date else None

# Serializer for Maintenance Record with read-only machine name and bill file URL
class MaintenanceRecordSerializer(serializers.ModelSerializer):
    machine_name = serializers.ReadOnlyField(source='machine.machine_number')
    bill_file = serializers.FileField(use_url=True, required=False, allow_null=True)

    class Meta:
        model = MaintenanceRecord
        fields = '__all__'

# Serializer for Work Entry creation
class WorkEntrySerializer(serializers.ModelSerializer):
    machine = serializers.PrimaryKeyRelatedField(queryset=Machine.objects.all())

    class Meta:
        model = WorkEntry
        fields = '__all__'

# Read-only serializer for Work Entry
class ReadOnlyWorkEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkEntry
        fields = '__all__'
        read_only_fields = '__all__'  # All fields are read-only

# Read-only serializer for Maintenance Record
class ReadOnlyMaintenanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceRecord
        fields = '__all__'
        read_only_fields = [f.name for f in MaintenanceRecord._meta.fields]

# Serializer for user activity log
class UserActivityLogSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = UserActivityLog
        fields = '__all__'
