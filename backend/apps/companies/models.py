import uuid
import secrets
import re
from django.db import models
from apps.core.models import SoftDeleteModel


class Company(SoftDeleteModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    cnpj = models.CharField(max_length=18, blank=True)
    sector = models.CharField(max_length=100, blank=True)
    webhook_token = models.CharField(max_length=64, unique=True, blank=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Company'
        verbose_name_plural = 'Companies'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.webhook_token:
            self.webhook_token = secrets.token_urlsafe(48)
        super().save(*args, **kwargs)

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.cnpj:
            pattern = r'^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$'
            if not re.match(pattern, self.cnpj):
                raise ValidationError({'cnpj': 'CNPJ must be in format XX.XXX.XXX/XXXX-XX.'})
