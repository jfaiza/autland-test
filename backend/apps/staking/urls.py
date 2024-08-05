from rest_framework import routers
from .views import StakingViewSet
from django.urls import path, include

router = routers.SimpleRouter()

router.register(r'staking', StakingViewSet, basename='staking')


urlpatterns = [
    path('', include(router.urls)),
]