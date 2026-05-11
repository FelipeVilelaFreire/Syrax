from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """Company admin. Super admins must use /api/admin/* endpoints instead."""

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and not request.user.is_superuser
            and request.user.role == 'admin'
        )


class IsOperatorOrAdmin(BasePermission):
    """Company admin or operator. Super admins must use /api/admin/* endpoints instead."""

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and not request.user.is_superuser
            and request.user.role in ('admin', 'operator')
        )
