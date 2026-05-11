from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Lead, Interaction
from .serializers import (
    LeadSerializer, LeadListSerializer, LeadWriteSerializer,
    InteractionSerializer, InteractionCreateSerializer,
)


class LeadViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'abandon_type', 'origin']
    search_fields = ['name', 'email', 'phone', 'product_name']
    ordering_fields = ['created_at', 'value', 'score', 'updated_at']

    def get_queryset(self):
        # Critical: always filter by company from TenantMiddleware
        return (
            Lead.objects
            .filter(company=self.request.company)
            .prefetch_related('interactions__user')
        )

    def get_serializer_class(self):
        if self.action == 'list':
            return LeadListSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return LeadWriteSerializer
        return LeadSerializer

    def perform_destroy(self, instance):
        instance.soft_delete()

    @action(detail=True, methods=['post'], url_path='trigger-ai')
    def trigger_ai(self, request, pk=None):
        lead = self.get_object()

        Interaction.objects.create(
            lead=lead,
            user=request.user,
            type=Interaction.Type.WHATSAPP_SENT,
            content='wa.me triggered',
        )

        if lead.status == Lead.Status.NOVO:
            lead.status = Lead.Status.EM_CONTATO
            lead.save(update_fields=['status', 'score'])

        return Response(LeadSerializer(lead).data)

    @action(detail=True, methods=['get', 'post'], url_path='interactions')
    def interactions(self, request, pk=None):
        lead = self.get_object()

        if request.method == 'GET':
            qs = lead.interactions.all()
            return Response(InteractionSerializer(qs, many=True).data)

        serializer = InteractionCreateSerializer(
            data=request.data,
            context={'request': request, 'lead': lead},
        )
        serializer.is_valid(raise_exception=True)
        interaction = serializer.save()
        return Response(InteractionSerializer(interaction).data, status=status.HTTP_201_CREATED)
