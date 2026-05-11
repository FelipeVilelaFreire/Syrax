import uuid
from django.db import models
from apps.core.models import SoftDeleteModel


class Integration(SoftDeleteModel):
    class Platform(models.TextChoices):
        KIWIFY = 'kiwify', 'Kiwify'
        HOTMART = 'hotmart', 'Hotmart'
        WHATSAPP = 'whatsapp', 'WhatsApp'

    class Status(models.TextChoices):
        CONNECTED = 'connected', 'Connected'
        DISCONNECTED = 'disconnected', 'Disconnected'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(
        'companies.Company', on_delete=models.CASCADE, related_name='integrations'
    )
    platform = models.CharField(max_length=20, choices=Platform.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DISCONNECTED)
    api_key = models.CharField(max_length=500, blank=True)
    total_events_received = models.IntegerField(default=0)

    class Meta:
        ordering = ['platform']
        unique_together = [('company', 'platform')]
        indexes = [
            models.Index(fields=['company', 'platform']),
        ]

    def __str__(self):
        return f'{self.platform} ({self.company})'
