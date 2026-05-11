from django.http import JsonResponse
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError


class TenantMiddleware:
    """
    Resolves request.company from the JWT access token's company_id claim.
    Sets request.company = None for unauthenticated requests (auth views handle
    their own 401s). ViewSets must call self.request.company and filter by it.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.company = None

        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token_str = auth_header.split(' ', 1)[1]
            try:
                token = AccessToken(token_str)
                company_id = token.get('company_id')
                if company_id:
                    from apps.companies.models import Company
                    try:
                        request.company = Company.objects.get(id=company_id)
                    except Company.DoesNotExist:
                        pass
            except TokenError:
                pass

        return self.get_response(request)
