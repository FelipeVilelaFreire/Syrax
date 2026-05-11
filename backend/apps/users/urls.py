from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('login/', views.login, name='user-login'),
    path('logout/', views.logout, name='user-logout'),
    path('me/', views.me, name='user-me'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
