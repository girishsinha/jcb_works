from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from core.views import yearly_working_hours, monthly_diesel_usage

from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


# 👇 Root home view
def home_view(request):
    return JsonResponse({"message": "Welcome to MS_JCB Django Backend"})

# 👇 Test API view
def test_api(request):
    return JsonResponse({"message": "Hello from Django!"})

# DRF Routers and ViewSets
from rest_framework.routers import DefaultRouter
from core.views import (
    MachineViewSet,
    OperatorViewSet,
    WorkRecordViewSet,
    MaintenanceRecordViewSet,
    WorkEntryCreateAPIView,  # ✅ Import new WorkEntry view
    OperatorSalaryViewSet,
)

# DRF router registration
router = DefaultRouter()
router.register(r'machines', MachineViewSet)
#router.register(r'operators', OperatorViewSet)
router.register(r'workrecords', WorkRecordViewSet)
router.register(r'maintenance-records', MaintenanceRecordViewSet)
router.register(r'operators', OperatorViewSet)
router.register(r'salary', OperatorSalaryViewSet, basename='salary-record')

#urlpatterns = router.urls

urlpatterns = [
    path('', home_view),  # Root URL
    path('admin/', admin.site.urls),
    path('api/test/', test_api),  # Test API endpoint
    path('api/', include(router.urls)),  # All router-based endpoints
    path('', include(router.urls)),
    # ✅ WorkEntry form endpoint
    path('api/work-entry/', WorkEntryCreateAPIView.as_view(), name='work-entry'),
    
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


urlpatterns += [
    path('api/dashboard/yearly-hours/', yearly_working_hours),
    path('api/monthly-diesel/', monthly_diesel_usage),
]
