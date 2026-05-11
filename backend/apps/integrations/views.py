from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Integration
from .serializers import IntegrationSerializer
from apps.companies.permissions import IsAdmin


class IntegrationViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = IntegrationSerializer

    def get_queryset(self):
        return Integration.objects.filter(company=self.request.company)
