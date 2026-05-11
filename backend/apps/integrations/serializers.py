from rest_framework import serializers
from .models import Integration


class IntegrationSerializer(serializers.ModelSerializer):
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Integration
        fields = [
            'id', 'platform', 'platform_display', 'status', 'status_display',
            'total_events_received', 'created_at', 'updated_at',
        ]
        read_only_fields = fields
