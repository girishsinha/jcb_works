from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import date

class CustomUser(AbstractUser):
    AUTH_LEVEL_CHOICES = (
        (1, 'Admin'),
        (2, 'Staff'),
        (3, 'Worker'),
    )
    authority_level = models.IntegerField(choices=AUTH_LEVEL_CHOICES, default=3)

#Machine Model
class Machine(models.Model):
    machine_number = models.CharField(max_length=50, unique=True)
    model_name = models.CharField(max_length=100)
    registration_date = models.DateField()
    papers = models.FileField(upload_to='machine_papers/', null=True, blank=True)

    def __str__(self):
        return self.machine_number


#Operator Model
class Operator(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    age = models.PositiveIntegerField()
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    registration_date = models.DateField(auto_now_add=True)  #NEW-LINE
    # registration_date = models.DateField(default=date.today)
    photo = models.FileField(upload_to='operator_photos/', null=True, blank=True)
    id_proof = models.FileField(upload_to='operator_ids/', null=True, blank=True)
    license = models.FileField(upload_to='operator_licenses/', null=True, blank=True)

    def __str__(self):
        return self.name

#Salary Record Model
class OperatorSalary(models.Model):
    operator = models.ForeignKey(Operator, on_delete=models.CASCADE)
    month = models.IntegerField()
    year = models.IntegerField()
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        unique_together = ('operator', 'month', 'year')

    @property
    def total_salary(self):
        return self.operator.salary

    @property
    def remaining_salary(self):
        return max(self.total_salary - self.amount_paid, 0)

    @property
    def status(self):
        if self.amount_paid == 0:
            return "Pending"
        elif self.amount_paid >= self.total_salary:
            return "Paid"
        else:
            return "Partially Paid"


#WorkRecord model
class WorkRecord(models.Model):
    WORK_TYPE_CHOICES = [
        ('plant', 'Plant Work'),
        ('farming', 'Farming Work'),
        ('soil', 'Digging/Loading Soil'),
        ('sand', 'Digging/Loading Sand'),
        ('local', 'Local Work'),
        ('drain', 'Digging a Drain'),
    ]
    PAYMENT_STATUS = [('pending', 'Pending'), ('done', 'Done')]

    machine = models.ForeignKey(Machine, on_delete=models.CASCADE)
    work_type = models.CharField(max_length=20, choices=WORK_TYPE_CHOICES)
    client_name = models.CharField(max_length=100)
    client_address = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    total_hours = models.FloatField()
    diesel_used = models.FloatField()
    rate_per_hour = models.FloatField()
    total_amount = models.FloatField()
    is_commission = models.BooleanField(default=False)
    commission_amount = models.FloatField(null=True, blank=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')

    def save(self, *args, **kwargs):
        self.total_amount = self.rate_per_hour * self.total_hours
        super().save(*args, **kwargs)


#Maintenance Model
class MaintenanceRecord(models.Model):
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE)
    maintenance_type = models.CharField(max_length=100)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=100)
    part_repaired = models.TextField()
    maintenance_date = models.DateField()
    description = models.TextField()
    bill_file = models.FileField(upload_to='maintenance_bills/', blank=True, null=True)

    def __str__(self):
        return f"{self.machine.machine_number} - {self.maintenance_type}"


#Model for work entry form
class WorkEntry(models.Model):
    WORK_TYPES = [
        ('Plant Work', 'Plant Work'),
        ('Farming Work', 'Farming Work'),
        ('Digging/Loading Soil', 'Digging/Loading Soil'),
        ('Digging/Loading Sand', 'Digging/Loading Sand'),
        ('Local Work', 'Local Work'),
        ('Digging a Drain', 'Digging a Drain'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Done', 'Done'),
    ]

    machine = models.ForeignKey('Machine', on_delete=models.CASCADE)
    work_type = models.CharField(max_length=50, choices=WORK_TYPES)
    client_name = models.CharField(max_length=100)
    client_address = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    total_working_hours = models.FloatField()
    diesel_used = models.FloatField()
    rate_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, editable=False)
    commission_based = models.BooleanField(default=False)
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Auto-calculate total_amount
        self.total_amount = self.total_working_hours * float(self.rate_per_hour)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.machine.machine_number} | {self.client_name} | {self.start_date}"
