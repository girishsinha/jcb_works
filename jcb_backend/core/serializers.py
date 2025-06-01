from rest_framework import serializers
from .models import Machine, Operator, WorkRecord, MaintenanceRecord, WorkEntry, OperatorSalary

class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = '__all__'

class OperatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Operator
        fields = '__all__'


class OperatorSalarySerializer(serializers.ModelSerializer):
    total_salary = serializers.ReadOnlyField()
    remaining_salary = serializers.ReadOnlyField()
    status = serializers.ReadOnlyField()

    class Meta:
        model = OperatorSalary
        fields = '__all__'

class WorkRecordSerializer(serializers.ModelSerializer):
    machine_details = serializers.CharField(source='machine', read_only=True)
    class Meta:
        model = WorkRecord
        fields = '__all__'

class MaintenanceRecordSerializer(serializers.ModelSerializer):
    machine_name = serializers.ReadOnlyField(source='machine.name')
    bill_file = serializers.FileField(use_url=True)
    class Meta:
        model = MaintenanceRecord
        fields = '__all__'

class WorkEntrySerializer(serializers.ModelSerializer):
    
    machine = serializers.PrimaryKeyRelatedField(queryset=Machine.objects.all())
    
    class Meta:
        model = WorkEntry
        fields = '__all__'