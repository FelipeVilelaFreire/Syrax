from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Company
from .serializers import CompanySerializer, CompanyCreateSerializer, CompanyUpdateSerializer
from .permissions import IsAdmin
from apps.core.permissions import IsSuperAdmin


class CompanyDetailView(APIView):
    """
    GET/PATCH /api/companies/me/
    Admin-only access to their own Company profile.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_company(self, request):
        if not request.company:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('No company associated with this account.')
        return request.company

    def get(self, request):
        company = self.get_company(request)
        return Response(CompanySerializer(company).data)

    def patch(self, request):
        company = self.get_company(request)
        serializer = CompanyUpdateSerializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(CompanySerializer(company).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def team_list(request):
    from apps.users.models import User
    from apps.users.serializers import UserSerializer
    users = User.objects.filter(company=request.company, is_active=True)
    return Response(UserSerializer(users, many=True).data)


class AdminCompanyViewSet(viewsets.ModelViewSet):
    """
    Full CRUD over all Companies. Super-admin only (SYRAX team).
    Mounted at /api/admin/companies/.
    """
    queryset = Company.objects.all().order_by('-created_at')
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get_serializer_class(self):
        if self.action == 'create':
            return CompanyCreateSerializer
        if self.action in ['update', 'partial_update']:
            return CompanyUpdateSerializer
        return CompanySerializer

    def perform_destroy(self, instance):
        instance.soft_delete()
