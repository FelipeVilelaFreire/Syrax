from rest_framework import serializers
from .models import Lead, Interaction


class InteractionSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Interaction
        fields = ['id', 'type', 'content', 'user_name', 'created_at']
        read_only_fields = fields

    def get_user_name(self, obj):
        return obj.user.name if obj.user else None


class InteractionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interaction
        fields = ['type', 'content']

    def create(self, validated_data):
        validated_data['lead'] = self.context['lead']
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class LeadSerializer(serializers.ModelSerializer):
    interactions = InteractionSerializer(many=True, read_only=True)
    time_without_contact = serializers.FloatField(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    abandon_type_display = serializers.CharField(source='get_abandon_type_display', read_only=True)

    class Meta:
        model = Lead
        fields = [
            'id', 'name', 'phone', 'email', 'product_name', 'value',
            'abandon_type', 'abandon_type_display', 'status', 'status_display',
            'origin', 'score', 'time_without_contact',
            'interactions', 'created_at', 'updated_at',
        ]
        read_only_fields = fields


class LeadListSerializer(serializers.ModelSerializer):
    time_without_contact = serializers.FloatField(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Lead
        fields = [
            'id', 'name', 'phone', 'email', 'product_name', 'value',
            'abandon_type', 'status', 'status_display', 'origin', 'score',
            'time_without_contact', 'created_at', 'updated_at',
        ]
        read_only_fields = fields


class LeadWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ['name', 'phone', 'email', 'product_name', 'value', 'abandon_type', 'status', 'origin']

    def validate_phone(self, value):
        import re
        cleaned = re.sub(r'\D', '', value)
        if len(cleaned) < 10:
            raise serializers.ValidationError('Phone must have at least 10 digits.')
        return f'+{cleaned}' if not value.startswith('+') else value

    def create(self, validated_data):
        validated_data['company'] = self.context['request'].company
        return super().create(validated_data)
