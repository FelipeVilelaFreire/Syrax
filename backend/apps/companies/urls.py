from django.urls import path
from . import views

urlpatterns = [
    path('companies/me/', views.CompanyDetailView.as_view(), name='company-me'),
    path('companies/team/', views.team_list, name='company-team'),
]
