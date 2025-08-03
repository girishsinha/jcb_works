from django.contrib import admin
from .models import Machine, Operator, WorkRecord, MaintenanceRecord, WorkEntry
from .models import CustomUser
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class CustomUserAdmin(BaseUserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'first_name', 'last_name', 'authority_level', 'is_staff', 'is_active')
    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {'fields': ('authority_level',)}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Machine)
admin.site.register(Operator)
admin.site.register(WorkRecord)
admin.site.register(MaintenanceRecord)
admin.site.register(WorkEntry)
