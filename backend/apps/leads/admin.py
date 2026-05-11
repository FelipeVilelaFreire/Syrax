from django.contrib import admin
from .models import Lead, Interaction


class InteractionInline(admin.TabularInline):
    model = Interaction
    extra = 0
    readonly_fields = ['id', 'type', 'user', 'content', 'created_at']
    can_delete = False


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ['name', 'company', 'status', 'abandon_type', 'value', 'score', 'origin', 'created_at']
    list_filter = ['status', 'abandon_type', 'company', 'origin']
    search_fields = ['name', 'email', 'phone', 'product_name']
    readonly_fields = ['id', 'score', 'created_at', 'updated_at']
    raw_id_fields = ['company']
    date_hierarchy = 'created_at'
    list_per_page = 50
    inlines = [InteractionInline]


@admin.register(Interaction)
class InteractionAdmin(admin.ModelAdmin):
    list_display = ['lead', 'type', 'user', 'created_at']
    list_filter = ['type', 'created_at']
    search_fields = ['lead__name', 'content']
    raw_id_fields = ['lead', 'user']
    readonly_fields = ['id', 'created_at']
