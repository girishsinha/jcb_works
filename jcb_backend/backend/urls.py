from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static

# JWT Token Views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView
)
from core.views import CustomTokenObtainPairView

# Core Views
from core.views import (
    UserInfoAPIView,
    MachineViewSet,
    OperatorViewSet,
    WorkRecordViewSet,
    MaintenanceRecordViewSet,
    MaintenanceRecordCreateUpdateAPIView,
    WorkEntryCreateAPIView,
    OperatorSalaryViewSet,
    UserActivityLogViewSet,
    UserRegistrationAPIView
)

# Default router for viewsets
from rest_framework.routers import DefaultRouter

# API Router Configuration
router = DefaultRouter()
router.register(r'machines', MachineViewSet)
router.register(r'workrecords', WorkRecordViewSet)
router.register(r'maintenance-records', MaintenanceRecordViewSet, basename='maintenance-record')
router.register(r'operators', OperatorViewSet)
router.register(r'salary', OperatorSalaryViewSet, basename='salary-record')
router.register(r'activity-logs', UserActivityLogViewSet)

# Optional health check or homepage
def home_view(request):
    return JsonResponse({"message": "Welcome to MS_JCB Django Backend"})

def test_api(request):
    return JsonResponse({"message": "Hello from Django!"})


# Final URL Patterns
urlpatterns = [
    path('', home_view),  # Landing route
    path('admin/', admin.site.urls),

    # Static test endpoint
    path('api/test/', test_api),

    # User-related
    path('api/user/', UserInfoAPIView.as_view(), name='user-info'),
    path('api/register-user/', UserRegistrationAPIView.as_view(), name='register-user'),

    # JWT Token Authentication Endpoints
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Work Entry Endpoint
    path('api/work-entry/', WorkEntryCreateAPIView.as_view(), name='work-entry'),

    # Maintenance Create & Update (separate from list/retrieve ViewSet)
    path('api/maintenance-records/create/', MaintenanceRecordCreateUpdateAPIView.as_view(), name='maintenance-create'),
    path('api/maintenance-records/<int:pk>/update/', MaintenanceRecordCreateUpdateAPIView.as_view(), name='maintenance-update'),

    # All Router-based ViewSets
    path('api/', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
