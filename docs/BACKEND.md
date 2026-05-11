# Backend — Django

> Concrete patterns for the Django side. Read this when creating apps, models, serializers, or endpoints.

Stack: **Django 5 + Django REST Framework + PostgreSQL 17 + SimpleJWT**.

---

## 📁 Project Structure

```
backend/
├── config/
│   ├── settings/
│   │   ├── base.py            # Shared settings
│   │   ├── development.py     # DEBUG=True, console email
│   │   └── production.py      # DEBUG=False, real email, S3
│   ├── urls.py                # Top-level URL include
│   ├── wsgi.py
│   └── asgi.py
│
├── apps/
│   ├── core/                  # SoftDeleteModel, base utilities
│   ├── users/                 # User model + JWT auth
│   ├── {{entity1}}/
│   ├── {{entity2}}/
│   └── audit/                 # Audit logs (optional)
│
├── manage.py
├── requirements.txt
├── .env                       # Secrets (gitignored)
└── .env.example               # Template
```

---

## 🧱 The `core/` App — Base Classes

Every project starts with `apps/core/` providing shared base classes.

### `SoftDeleteModel`

```python
# apps/core/models.py
from django.db import models
from django.utils import timezone

class SoftDeleteManager(models.Manager):
    """Returns only non-deleted rows by default."""
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)

class SoftDeleteModel(models.Model):
    """Base class. Use .objects (live) or .all_objects (incl. deleted)."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.save(update_fields=['deleted_at'])

    def restore(self):
        self.deleted_at = None
        self.save(update_fields=['deleted_at'])
```

Every domain model inherits `SoftDeleteModel` unless there's a specific reason not to.

---

## 👤 Users App — JWT Auth

### Model — email login

```python
# apps/users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
```

In `settings/base.py`:
```python
AUTH_USER_MODEL = 'users.User'
```

### JWT setup (SimpleJWT)

```python
# settings/base.py
from datetime import timedelta

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

### Auth endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/users/register/` | Create user |
| `POST /api/users/login/` | Returns `{ access, refresh, user }` |
| `POST /api/users/logout/` | Blacklists refresh token |
| `POST /api/users/token/refresh/` | New access token |
| `GET /api/users/me/` | Current user profile |
| `PATCH /api/users/me/` | Update profile |

---

## 🧱 Standard Model Pattern

```python
# apps/order/models.py
from django.db import models
from apps.core.models import SoftDeleteModel
from apps.users.models import User

class Order(SoftDeleteModel):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PAID = 'paid', 'Paid'
        SHIPPED = 'shipped', 'Shipped'
        DELIVERED = 'delivered', 'Delivered'
        CANCELLED = 'cancelled', 'Cancelled'

    customer = models.ForeignKey(User, on_delete=models.PROTECT, related_name='orders')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['customer', '-created_at']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f'Order #{self.pk} ({self.status})'
```

Conventions:
- Inherit `SoftDeleteModel`
- Use `TextChoices` for enums (string-typed)
- Add `Meta.ordering` for default sort
- Add indexes for fields used in filters/lookups
- `on_delete=PROTECT` for FKs unless cascade is intended

---

## 📝 Serializer Pattern — Read vs Write Split

Separate read and write serializers when shapes diverge significantly.

```python
# apps/order/serializers.py
from rest_framework import serializers
from apps.users.serializers import UserMinimalSerializer
from .models import Order

class OrderSerializer(serializers.ModelSerializer):
    """Read serializer — nested relationships, computed fields."""
    customer = UserMinimalSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'customer', 'status', 'status_display',
            'total_amount', 'notes', 'created_at', 'updated_at',
        ]
        read_only_fields = fields

class OrderWriteSerializer(serializers.ModelSerializer):
    """Write serializer — only the fields the client can set."""

    class Meta:
        model = Order
        fields = ['status', 'total_amount', 'notes']

    def validate_total_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Total must be greater than zero.')
        return value

    def create(self, validated_data):
        validated_data['customer'] = self.context['request'].user
        return super().create(validated_data)
```

Rules:
- Read serializer: nested relationships, all `read_only`
- Write serializer: only client-settable fields
- Implement `validate_<field>` for per-field rules
- Implement `validate(self, attrs)` for cross-field rules
- Inject `request.user` from context — never trust client

---

## 🎯 ViewSet Pattern

```python
# apps/order/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Order
from .serializers import OrderSerializer, OrderWriteSerializer
from .permissions import IsOwnerOrReadOnly

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related('customer').all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'customer']
    search_fields = ['notes']
    ordering_fields = ['created_at', 'total_amount']

    def get_queryset(self):
        # Users see only their orders unless staff
        qs = super().get_queryset()
        if not self.request.user.is_staff:
            qs = qs.filter(customer=self.request.user)
        return qs

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return OrderWriteSerializer
        return OrderSerializer

    def perform_destroy(self, instance):
        instance.soft_delete()

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status != Order.Status.PENDING:
            return Response(
                {'detail': 'Only pending orders can be cancelled.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        order.status = Order.Status.CANCELLED
        order.save(update_fields=['status'])
        return Response(OrderSerializer(order).data)
```

Conventions:
- Always `select_related` / `prefetch_related` to avoid N+1
- Filter by user in `get_queryset` (never trust client)
- Switch serializer via `get_serializer_class`
- Custom actions use `@action(detail=True/False)`
- Soft-delete on destroy

---

## 🔐 Permissions Pattern

```python
# apps/order/permissions.py
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """Read for any authenticated user, write only for owner."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.customer == request.user
```

For complex scenarios, write multiple permissions and combine:
```python
permission_classes = [permissions.IsAuthenticated, IsOwner | IsAdmin]
```

---

## 🌐 URL Conventions

```python
# apps/order/urls.py
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet

router = DefaultRouter()
router.register('orders', OrderViewSet, basename='order')
urlpatterns = router.urls
```

```python
# config/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('apps.users.urls')),
    path('api/', include('apps.order.urls')),
    path('api/', include('apps.{{entity2}}.urls')),
    path('api/docs/', include('drf_spectacular.urls')),
]
```

Endpoint shape:
| HTTP | Path | Action |
|------|------|--------|
| `GET` | `/api/orders/` | list |
| `POST` | `/api/orders/` | create |
| `GET` | `/api/orders/{id}/` | retrieve |
| `PATCH` | `/api/orders/{id}/` | partial update |
| `DELETE` | `/api/orders/{id}/` | soft delete |
| `POST` | `/api/orders/{id}/cancel/` | custom action |

---

## 🎨 Admin Pattern

```python
# apps/order/admin.py
from django.contrib import admin
from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['customer__email', 'notes']
    raw_id_fields = ['customer']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 50
```

Defaults:
- `list_display` — most relevant columns
- `list_filter` — for fast slicing
- `search_fields` — full-text on relevant text columns
- `raw_id_fields` — for FKs to large tables (avoids dropdown of millions)

---

## 🧬 Migration Discipline

- One migration per logical change. Don't bundle unrelated changes.
- Never edit applied migrations. Add a new one.
- Squash periodically (every ~30 migrations per app).
- Migration files are reviewed code — explain non-obvious data migrations in comments.

```bash
python manage.py makemigrations app_name
python manage.py migrate
python manage.py sqlmigrate app_name 0042  # inspect SQL
```

---

## ⚙️ Settings Split

```python
# config/settings/base.py — shared
import os
from pathlib import Path
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent.parent
SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', cast=bool, default=False)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')

INSTALLED_APPS = [
    # Django
    'django.contrib.admin', 'django.contrib.auth', ...
    # Third-party
    'rest_framework', 'corsheaders', 'django_filters', 'drf_spectacular',
    # Local
    'apps.core', 'apps.users', 'apps.{{entity1}}', 'apps.{{entity2}}',
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DATABASE_NAME'),
        'USER': config('DATABASE_USER'),
        'PASSWORD': config('DATABASE_PASSWORD'),
        'HOST': config('DATABASE_HOST', default='localhost'),
        'PORT': config('DATABASE_PORT', default='5432'),
    }
}
```

```python
# config/settings/development.py
from .base import *
DEBUG = True
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
```

```python
# config/settings/production.py
from .base import *
DEBUG = False
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
EMAIL_BACKEND = 'django_ses.SESBackend'  # or similar
```

---

## 🧪 Testing

```python
# apps/order/tests/test_views.py
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.models import User
from apps.order.models import Order

class OrderViewSetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='a@b.com', password='x', username='a')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {RefreshToken.for_user(self.user).access_token}')

    def test_user_only_sees_own_orders(self):
        Order.objects.create(customer=self.user, total_amount=100)
        other = User.objects.create_user(email='b@c.com', password='x', username='b')
        Order.objects.create(customer=other, total_amount=200)

        response = self.client.get('/api/orders/')
        self.assertEqual(len(response.data['results']), 1)
```

Run: `python manage.py test apps.order`.

---

## 🗺️ Optional: GeoDjango (location features)

Enable when the project needs geographical queries (proximity, polygon containment).

```python
# settings/base.py
INSTALLED_APPS += ['django.contrib.gis']
DATABASES['default']['ENGINE'] = 'django.contrib.gis.db.backends.postgis'

# Enable PostGIS extension once
# psql -d mydb -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

```python
# Model
from django.contrib.gis.db import models as gis_models

class Place(SoftDeleteModel):
    location = gis_models.PointField(null=True)
```

```python
# Proximity query
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance

origin = Point(lng, lat, srid=4326)
nearby = Place.objects.annotate(
    distance=Distance('location', origin)
).filter(distance__lte=5000).order_by('distance')  # 5km
```

---

## 📨 Optional: Email (SES in production)

```python
# requirements.txt
django-ses==3.5.0

# settings/production.py
EMAIL_BACKEND = 'django_ses.SESBackend'
AWS_SES_REGION_NAME = config('AWS_SES_REGION', default='us-east-1')
AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY')
DEFAULT_FROM_EMAIL = '{{PROJECT_NAME}} <noreply@{{domain}}>'
```

---

## 🚦 Pre-merge Backend Checklist

- [ ] New model inherits `SoftDeleteModel`?
- [ ] Migrations are atomic (one logical change per migration)?
- [ ] Read and write serializers separated when shapes differ?
- [ ] `validate_<field>` and `validate()` cover all business rules?
- [ ] ViewSet filters by user in `get_queryset` (never trust client)?
- [ ] Permission classes set explicitly (don't rely on global default for sensitive endpoints)?
- [ ] `select_related` / `prefetch_related` for any FK touched in serializer?
- [ ] Indexes on fields used in filters / orderings?
- [ ] Admin registration added for new model?
- [ ] Tests cover happy path + at least one auth/authorization edge case?
