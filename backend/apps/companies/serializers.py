import re
from rest_framework import serializers
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'cnpj', 'sector', 'webhook_token', 'created_at', 'updated_at']
        read_only_fields = ['id', 'webhook_token', 'created_at', 'updated_at']


class CompanyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['name', 'cnpj', 'sector']

    def validate_cnpj(self, value):
        if value and not re.match(r'^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$', value):
            raise serializers.ValidationError('CNPJ must be in format XX.XXX.XXX/XXXX-XX.')
        return value

    def create(self, validated_data):
        company = Company.objects.create(**validated_data)
        # Link the requesting user as admin
        user = self.context['request'].user
        user.company = company
        user.role = 'admin'
        user.save(update_fields=['company', 'role'])
        return company


class CompanyUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['name', 'cnpj', 'sector']

    def validate_cnpj(self, value):
        if value and not re.match(r'^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$', value):
            raise serializers.ValidationError('CNPJ must be in format XX.XXX.XXX/XXXX-XX.')
        return value
