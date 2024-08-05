from rest_framework import routers
from django.urls import path
from .views import (
    DelegatorRetrieveView
)

urlpatterns = [
    path('delegators/', DelegatorRetrieveView.as_view(), name='validators-list'),
]


