from rest_framework import permissions


class IsSuperAdmin(permissions.BasePermission):
    """SYRAX platform staff. Bypasses tenant filtering."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)
