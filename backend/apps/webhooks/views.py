from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.core.authentication import WebhookTokenAuthentication
from apps.leads.models import Lead
from apps.integrations.models import Integration
from .parsers import kiwify, hotmart


def _process_webhook(request, platform_name: str, parser_module):
    company = request.company
    if not company:
        return Response({'detail': 'Invalid token.'}, status=status.HTTP_401_UNAUTHORIZED)

    payload = request.data
    lead_data = parser_module.parse(payload)

    if lead_data is None:
        return Response({'detail': 'Event ignored.'}, status=status.HTTP_200_OK)

    Lead.objects.create(company=company, **lead_data)

    Integration.objects.filter(
        company=company, platform=platform_name
    ).update(
        status=Integration.Status.CONNECTED,
        total_events_received=Integration.objects.filter(
            company=company, platform=platform_name
        ).values_list('total_events_received', flat=True).first() or 0
    )
    # Increment counter separately to avoid race condition in update above
    Integration.objects.filter(company=company, platform=platform_name).update(
        total_events_received=Integration._default_manager.filter(
            company=company, platform=platform_name
        ).values_list('total_events_received', flat=True).first() + 1
        if Integration.objects.filter(company=company, platform=platform_name).exists()
        else 1
    )

    return Response({'detail': 'Lead created.'}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@authentication_classes([WebhookTokenAuthentication])
@permission_classes([AllowAny])
def kiwify_webhook(request, webhook_token):
    return _process_webhook(request, Integration.Platform.KIWIFY, kiwify)


@api_view(['POST'])
@authentication_classes([WebhookTokenAuthentication])
@permission_classes([AllowAny])
def hotmart_webhook(request, webhook_token):
    return _process_webhook(request, Integration.Platform.HOTMART, hotmart)
