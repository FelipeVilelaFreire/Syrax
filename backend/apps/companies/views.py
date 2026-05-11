from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.models import User
from apps.users.serializers import UserSerializer, TeamMemberCreateSerializer, TeamMemberUpdateSerializer
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


class TeamView(APIView):
    """
    GET  /companies/team/  → list all team members (active + inactive)
    POST /companies/team/  → create a new operator or admin in this company
    Company admin only.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        members = User.objects.filter(company=request.company).order_by('name')
        return Response(UserSerializer(members, many=True).data)

    def post(self, request):
        serializer = TeamMemberCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        member = serializer.save()
        return Response(UserSerializer(member).data, status=status.HTTP_201_CREATED)


class TeamDetailView(APIView):
    """
    GET    /companies/team/{id}/  → retrieve team member
    PATCH  /companies/team/{id}/  → update name, role, or is_active
    DELETE /companies/team/{id}/  → deactivate (sets is_active=False, not hard delete)
    Company admin only. Cannot touch members from another company.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_member(self, request, pk):
        try:
            return User.objects.get(id=pk, company=request.company)
        except User.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound('Team member not found.')

    def get(self, request, pk):
        return Response(UserSerializer(self.get_member(request, pk)).data)

    def patch(self, request, pk):
        member = self.get_member(request, pk)
        serializer = TeamMemberUpdateSerializer(member, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(member).data)

    def delete(self, request, pk):
        member = self.get_member(request, pk)
        if member == request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You cannot deactivate your own account.')
        member.is_active = False
        member.save(update_fields=['is_active'])
        return Response(status=status.HTTP_204_NO_CONTENT)


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
