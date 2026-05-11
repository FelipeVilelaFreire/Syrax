from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender='leads.Interaction')
def recompute_lead_score_on_interaction(sender, instance, created, **kwargs):
    if created:
        lead = instance.lead
        from .models import compute_score
        lead.score = compute_score(lead)
        lead.save(update_fields=['score'])
