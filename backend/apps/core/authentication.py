from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


class WebhookTokenAuthentication(BaseAuthentication):
    """
    Resolves Company from webhook_token in the URL path.
    Used exclusively by apps.webhooks views.
    Sets request.company; request.user remains AnonymousUser.
    """

    def authenticate(self, request):
        webhook_token = request.resolver_match.kwargs.get('webhook_token')
        if not webhook_token:
            return None

        from apps.companies.models import Company
        try:
            company = Company.objects.get(webhook_token=webhook_token)
        except Company.DoesNotExist:
            raise AuthenticationFailed('Invalid webhook token.')

        request.company = company
        return (None, None)
