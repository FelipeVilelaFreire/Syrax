"""URLs exposed under /api/admin/ — SYRAX super-admin only (Vite admin panel)."""
from rest_framework.routers import DefaultRouter

from apps.companies.views import AdminCompanyViewSet
from apps.users.admin_views import AdminUserViewSet

router = DefaultRouter()
router.register('companies', AdminCompanyViewSet, basename='admin-company')
router.register('users', AdminUserViewSet, basename='admin-user')

urlpatterns = router.urls
