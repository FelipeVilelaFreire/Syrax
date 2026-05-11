from django.urls import path
from . import views

urlpatterns = [
    path('companies/me/', views.CompanyDetailView.as_view(), name='company-me'),
    path('companies/team/', views.TeamView.as_view(), name='company-team'),
    path('companies/team/<uuid:pk>/', views.TeamDetailView.as_view(), name='company-team-detail'),
]
