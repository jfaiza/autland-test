from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from backend.apps.staking.urls import urlpatterns as staking_urls
from backend.apps.validators.urls import urlpatterns as validators_urls
from backend.apps.delegators.urls import urlpatterns as delegators_urls
from backend.apps.chains.urls import urlpatterns as chains_urls
from backend.apps.user.views import CreateUserView

# import scripts.production_data 
# print(generate_account(), generate_secret_key())

# Create a default router instance
defaultRouter = routers.DefaultRouter()

# Register routers
# defaultRouter.urls.extend(staking_urls)
defaultRouter.urls.extend(validators_urls)
defaultRouter.urls.extend(delegators_urls)
defaultRouter.urls.extend(chains_urls)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', CreateUserView.as_view(), name='register'),
    path('api/', include(defaultRouter.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='refresh'),
    path('api_auth/', include('rest_framework.urls', namespace='rest_framework'))
]
