from rest_framework.permissions import BasePermission


class BelongsToSameCompany(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.company == request.company
