from rest_framework import viewsets, serializers
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import UserSerializer
from apps.core.permissions import IsSuperAdmin


class AdminUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'name', 'password', 'role', 'company', 'is_active', 'is_superuser']

    def validate_email(self, value):
        return value.lower()

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class AdminUserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True, min_length=8)

    class Meta:
        model = User
        fields = ['name', 'role', 'company', 'is_active', 'is_superuser', 'password']

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for k, v in validated_data.items():
            setattr(instance, k, v)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class AdminUserViewSet(viewsets.ModelViewSet):
    """Full CRUD over all Users. SYRAX super-admin only."""
    queryset = User.objects.all().order_by('-created_at')
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get_serializer_class(self):
        if self.action == 'create':
            return AdminUserCreateSerializer
        if self.action in ['update', 'partial_update']:
            return AdminUserUpdateSerializer
        return UserSerializer
