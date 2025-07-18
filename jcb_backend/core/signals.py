from django.db.models.signals import post_save
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from .models import WorkEntry, WorkRecord, UserActivityLog

# Mapping function to convert WorkEntry work_type to WorkRecord work_type
def map_work_type(entry_type):
    mapping = {
        'Plant Work': 'plant',
        'Farming Work': 'farming',
        'Digging/Loading Soil': 'soil',
        'Digging/Loading Sand': 'sand',
        'Local Work': 'local',
        'Digging a Drain': 'drain',
    }
    return mapping.get(entry_type, 'local')  # Default to 'local' if unknown


# 🔵 Log user login activity
@receiver(user_logged_in)
def log_login(sender, request, user, **kwargs):
    try:
        UserActivityLog.objects.create(user=user, action="LOGIN", description="User logged in")
    except Exception as e:
        print(f"[Login Logging Failed] {e}")


# 🔵 Log user logout activity
@receiver(user_logged_out)
def log_logout(sender, request, user, **kwargs):
    try:
        UserActivityLog.objects.create(user=user, action="LOGOUT", description="User logged out")
    except Exception as e:
        print(f"[Logout Logging Failed] {e}")


# 🔁 Auto-create WorkRecord when a WorkEntry is created
@receiver(post_save, sender=WorkEntry)
def create_workrecord_from_entry(sender, instance, created, **kwargs):
    if created:
        try:
            WorkRecord.objects.create(
                machine=instance.machine,
                work_type=map_work_type(instance.work_type),
                client_name=instance.client_name,
                client_address=instance.client_address,
                start_date=instance.start_date,
                end_date=instance.end_date,
                total_hours=instance.total_working_hours,
                diesel_used=instance.diesel_used,
                rate_per_hour=float(instance.rate_per_hour),
                total_amount=instance.total_working_hours * float(instance.rate_per_hour),
                is_commission=instance.commission_based,
                commission_amount=instance.commission_amount or 0,
                payment_status=(instance.payment_status or '').lower(),
            )
        except Exception as e:
            print(f"[WorkRecord Creation Failed] {e}")
