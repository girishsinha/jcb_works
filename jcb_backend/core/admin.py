from django.contrib import admin
from .models import Machine, Operator, WorkRecord, MaintenanceRecord, WorkEntry

admin.site.register(Machine)
admin.site.register(Operator)
admin.site.register(WorkRecord)
admin.site.register(MaintenanceRecord)
admin.site.register(WorkEntry)

