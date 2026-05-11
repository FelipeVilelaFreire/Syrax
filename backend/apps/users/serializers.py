from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User


class UserSerializer(serializers.ModelSerializer):
    company_id   = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role', 'is_active', 'is_superuser', 'company_id', 'company_name', 'created_at']
        read_only_fields = fields

    def get_company_id(self, obj):
        return str(obj.company_id) if obj.company_id else None

    def get_company_name(self, obj):
        return obj.company.name if obj.company_id else None


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        from django.contrib.auth import authenticate
        user = authenticate(
            request=self.context.get('request'),
            username=attrs['email'].lower(),
            password=attrs['password'],
        )
        if not user:
            raise serializers.ValidationError('Invalid credentials.')
        if not user.is_active:
            raise serializers.ValidationError('Account is disabled.')
        attrs['user'] = user
        return attrs


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name']


class TeamMemberCreateSerializer(serializers.ModelSerializer):
    """Used by company admins to invite new operators or admins to their tenant."""

    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'name', 'password', 'role']

    def validate_email(self, value):
        return value.lower()

    def create(self, validated_data):
        company = self.context['request'].company
        return User.objects.create_user(company=company, **validated_data)


class TeamMemberUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'role', 'is_active']


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    refresh['company_id'] = str(user.company_id) if user.company_id else None
    refresh['role'] = user.role
    refresh['is_superuser'] = user.is_superuser
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
