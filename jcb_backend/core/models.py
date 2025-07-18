from django.db import models
from django.contrib.auth.models import AbstractUser, Group
from datetime import date

# -----------------------
# ✅ Custom User Model
# -----------------------
class CustomUser(AbstractUser):
    AUTH_LEVEL_CHOICES = (
        (1, 'Admin'),
        (2, 'Staff'),
        (3, 'Worker'),
    )
    authority_level = models.IntegerField(choices=AUTH_LEVEL_CHOICES, default=3)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        try:
            group_map = {
                1: 'Level_1_Owner_admin',
                2: 'Level_2_Staff_',
                3: 'Level_3_Employee_operator',
            }
            group_name = group_map.get(self.authority_level)
            if group_name:
                group, _ = Group.objects.get_or_create(name=group_name)
                self.groups.set([group])
        except Exception as e:
            print("❌ Group assignment failed:", e) 

# -----------------------
# ✅ Machine Model
# -----------------------
class Machine(models.Model):
    machine_number = models.CharField(max_length=50, unique=True)
    model_name = models.CharField(max_length=100)

    # SECTION 1: Basic Details
    manufacturer = models.CharField(max_length=100, null=True, blank=True)
    manufacturing_year = models.PositiveIntegerField(null=True, blank=True)
    engine_number = models.CharField(max_length=100, null=True, blank=True)
    chassis_number = models.CharField(max_length=100, null=True, blank=True)
    machine_type = models.CharField(max_length=100, null=True, blank=True)

    # SECTION 2: Ownership & Insurance
    owner_name = models.CharField(max_length=100, null=True, blank=True)
    owner_contact = models.CharField(max_length=20, null=True, blank=True)
    owner_address = models.TextField(null=True, blank=True)
    insurance_provider = models.CharField(max_length=100, null=True, blank=True)
    insurance_policy_no = models.CharField(max_length=100, null=True, blank=True)
    insurance_expiry = models.DateField(null=True, blank=True)

    # SECTION 3: Legal / Government
    rc_book_no = models.CharField(max_length=100, null=True, blank=True)
    pollution_cert_no = models.CharField(max_length=100, null=True, blank=True)
    pollution_expiry = models.DateField(null=True, blank=True)
    fitness_cert_no = models.CharField(max_length=100, null=True, blank=True)
    fitness_expiry = models.DateField(null=True, blank=True)
    road_tax_validity = models.DateField(null=True, blank=True)
    permit_type = models.CharField(max_length=100, null=True, blank=True)
    permit_expiry = models.DateField(null=True, blank=True)
    owner_id = models.FileField(upload_to='machine_docs/', null=True, blank=True)

    # SECTION 4: Operational
    status = models.CharField(max_length=50, null=True, blank=True)
    assigned_site = models.CharField(max_length=100, null=True, blank=True)
    fuel_type = models.CharField(max_length=20, null=True, blank=True)
    fuel_capacity = models.PositiveIntegerField(null=True, blank=True)
    fuel_consumption = models.FloatField(null=True, blank=True)
    working_hours = models.PositiveIntegerField(null=True, blank=True)

    # SECTION 5: Uploads
    rc_upload = models.FileField(upload_to='machine_docs/', null=True, blank=True)
    insurance_copy = models.FileField(upload_to='machine_docs/', null=True, blank=True)
    fitness_cert = models.FileField(upload_to='machine_docs/', null=True, blank=True)
    pollution_cert = models.FileField(upload_to='machine_docs/', null=True, blank=True)
    permit_doc = models.FileField(upload_to='machine_docs/', null=True, blank=True)
    owner_photo_id = models.FileField(upload_to='machine_docs/', null=True, blank=True)
    machine_photo = models.FileField(upload_to='machine_docs/', null=True, blank=True)

    def __str__(self):
        return self.machine_number

# -----------------------
# ✅ Operator Model
# -----------------------
class Operator(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    age = models.PositiveIntegerField()
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    registration_date = models.DateField(auto_now_add=True)
    photo = models.FileField(upload_to='operator_photos/', null=True, blank=True)
    id_proof = models.FileField(upload_to='operator_ids/', null=True, blank=True)
    license = models.FileField(upload_to='operator_licenses/', null=True, blank=True)

    def __str__(self):
        return self.name

# -----------------------
# ✅ Operator Salary Model
# -----------------------
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

# -----------------------
# ✅ Work Record Model
# -----------------------
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

# -----------------------
# ✅ Maintenance Record Model
# -----------------------
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

# -----------------------
# ✅ Work Entry Model
# -----------------------
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
        self.total_amount = self.total_working_hours * float(self.rate_per_hour)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.machine.machine_number} | {self.client_name} | {self.start_date}"

# -----------------------
# ✅ User Activity Log
# -----------------------
class UserActivityLog(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    action = models.CharField(max_length=100)  # LOGIN, LOGOUT, CREATE, UPDATE, DELETE
    model_name = models.CharField(max_length=100, null=True, blank=True)
    object_id = models.IntegerField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.action} at {self.timestamp}"
