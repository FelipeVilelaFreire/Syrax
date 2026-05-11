from django.contrib import admin
from .models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'cnpj', 'sector', 'created_at']
    list_filter = ['sector', 'created_at']
    search_fields = ['name', 'cnpj']
    readonly_fields = ['id', 'webhook_token', 'created_at', 'updated_at']
    list_per_page = 50
