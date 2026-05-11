from django.contrib import admin
from .models import Integration


@admin.register(Integration)
class IntegrationAdmin(admin.ModelAdmin):
    list_display = ['company', 'platform', 'status', 'total_events_received', 'created_at']
    list_filter = ['platform', 'status']
    search_fields = ['company__name']
    readonly_fields = ['id', 'total_events_received', 'created_at', 'updated_at']
    raw_id_fields = ['company']
