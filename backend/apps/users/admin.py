from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'name', 'role', 'company', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'company']
    search_fields = ['email', 'name']
    ordering = ['email']
    readonly_fields = ['id', 'created_at']

    fieldsets = (
        (None, {'fields': ('id', 'email', 'password')}),
        ('Info', {'fields': ('name', 'role', 'company', 'is_active')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates', {'fields': ('created_at', 'last_login')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'role', 'company', 'password1', 'password2'),
        }),
    )
