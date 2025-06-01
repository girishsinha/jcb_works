from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import WorkEntry, WorkRecord

@receiver(post_save, sender=WorkEntry)
def create_workrecord_from_entry(sender, instance, created, **kwargs):
    if created:
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
            is_commission=instance.commission_based,
            commission_amount=instance.commission_amount or 0,
            payment_status=instance.payment_status.lower(),
        )

def map_work_type(entry_type):
    mapping = {
        'Plant Work': 'plant',
        'Farming Work': 'farming',
        'Digging/Loading Soil': 'soil',
        'Digging/Loading Sand': 'sand',
        'Local Work': 'local',
        'Digging a Drain': 'drain',
    }
    return mapping.get(entry_type, 'local')
