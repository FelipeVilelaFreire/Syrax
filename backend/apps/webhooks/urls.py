from django.urls import path
from . import views

urlpatterns = [
    path('kiwify/<str:webhook_token>/', views.kiwify_webhook, name='webhook-kiwify'),
    path('hotmart/<str:webhook_token>/', views.hotmart_webhook, name='webhook-hotmart'),
]
