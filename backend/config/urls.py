from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('apps.users.urls')),
    path('api/admin/', include('apps.core.admin_urls')),
    path('api/', include('apps.companies.urls')),
    path('api/', include('apps.leads.urls')),
    path('api/', include('apps.integrations.urls')),
    path('api/webhooks/', include('apps.webhooks.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs'),
]
