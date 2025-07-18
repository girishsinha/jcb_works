from rest_framework.permissions import BasePermission

class IsOwnerAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.groups.filter(name='Level_1_Owner_admin').exists()

class IsStaffLevel(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.groups.filter(name='Level_2_Staff_').exists()

class IsEmployeeOperator(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.groups.filter(name='Level_3_Employee_operator').exists()


class IsOwnerOrStaff(BasePermission):
    def has_permission(self, request, view):
        return request.user and (
            request.user.groups.filter(name='Level_1_Owner_admin').exists() or
            request.user.groups.filter(name='Level_2_Staff_').exists()
        )
