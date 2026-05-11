import uuid
from django.db import models
from django.utils import timezone
from apps.core.models import SoftDeleteModel


def compute_score(lead) -> int:
    now = timezone.now()
    last_interaction = lead.interactions.order_by('-created_at').first()
    base_time = last_interaction.created_at if last_interaction else lead.created_at
    hours_since = (now - base_time).total_seconds() / 3600

    recency = max(0, 50 - hours_since / 2)
    value_pts = min(40, float(lead.value or 0) / 50)
    engagement = min(30, lead.interactions.count() * 5)

    return min(100, int(recency + value_pts + engagement))


class Lead(SoftDeleteModel):
    class AbandonType(models.TextChoices):
        PIX = 'pix', 'Pix'
        BOLETO = 'boleto', 'Boleto'
        CART = 'cart', 'Cart'

    class Status(models.TextChoices):
        NOVO = 'novo', 'Novo'
        EM_CONTATO = 'em_contato', 'Em Contato'
        CONVERTIDO = 'convertido', 'Convertido'
        PERDIDO = 'perdido', 'Perdido'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(
        'companies.Company', on_delete=models.PROTECT, related_name='leads'
    )
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    product_name = models.CharField(max_length=200)
    value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    abandon_type = models.CharField(
        max_length=10, choices=AbandonType.choices, default=AbandonType.CART
    )
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.NOVO
    )
    origin = models.CharField(max_length=100, default='manual')
    score = models.IntegerField(default=0)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['company', '-created_at']),
            models.Index(fields=['company', 'status']),
            models.Index(fields=['company', 'score']),
        ]

    def __str__(self):
        return f'{self.name} ({self.status})'

    @property
    def time_without_contact(self):
        last = self.interactions.order_by('-created_at').first()
        base = last.created_at if last else self.created_at
        return (timezone.now() - base).total_seconds() / 3600

    def save(self, *args, **kwargs):
        # Score is recomputed only when already persisted (has PK) to avoid
        # querying interactions before they exist on first save
        if self.pk:
            self.score = compute_score(self)
        super().save(*args, **kwargs)


class Interaction(models.Model):
    class Type(models.TextChoices):
        WHATSAPP_SENT = 'whatsapp_sent', 'WhatsApp Sent'
        STATUS_CHANGE = 'status_change', 'Status Change'
        NOTE = 'note', 'Note'
        AI_TRIGGERED = 'ai_triggered', 'AI Triggered'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='interactions')
    user = models.ForeignKey(
        'users.User', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='interactions'
    )
    type = models.CharField(max_length=30, choices=Type.choices)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['lead', '-created_at']),
        ]

    def __str__(self):
        return f'{self.type} on {self.lead}'
