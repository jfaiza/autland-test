from rest_framework import routers
from django.urls import path
from .views import (
    ValidatorsListView,
    ValidatorsDetailsListView,
    ValidatorsLatesUpdatetView,
    ValidatorsDestroyAllView,
    DashboardValidators,
    ValidatorDetailAPIView,
    StakeView
)

urlpatterns = [
    path('validators/', ValidatorsListView.as_view(), name='validators-list'),
    path('validators/details/', ValidatorsDetailsListView.as_view(), name='validator'),
    path('validator/', ValidatorDetailAPIView.as_view(), name='validators-list'),
    path('validators/all/destroy/', ValidatorsDestroyAllView.as_view(), name='validators-list-destroy'),
#     path('validators/<int:pk>/', ValidatorsRetrieveView.as_view(), name='validators-detail'),
#     path('validators/user/<int:pk>/', ValidatorsRetrieveUpdateDestroyView.as_view(), name='validators-detail'),
#     path('validators/latest/', ValidatorsLatestView.as_view(), name='validators-latest'),
    path('validators/latest_update/', ValidatorsLatesUpdatetView.as_view(), name='validators-latest_update'),
#     path('validators/custom_post/', ValidatorsCustomPostView.as_view(), name='validators-custom-post'),

    # avoid duplicate dates in history objects
    # path('validators/modify_histories/', ValidatorsUpdateHistoryData.as_view(), name='validators-modify_histories'),
    path('validator/stake/', StakeView.as_view(), name='stake'),
    path('validators/dashboard/', DashboardValidators.as_view(), name='dashboard'),
]





# router = routers.DefaultRouter()

# create_validator_view = ValidatorsViewSet.as_view({'post': 'create'})
# list_validators_view = ValidatorsViewSet.as_view({'get': 'list'})
# retrieve_validators_view = ValidatorsViewSet.as_view({'get': 'retrieve'})
# delete_validators_view = ValidatorsViewSet.as_view({'delete': 'destroy'})


# urlpatterns = [
#     path('validators/create/', create_validator_view, name='create_validator'),
#     path('validators/list/', list_validators_view, name='list_validators'),
#     path('validators/retrieve/<int:pk>', retrieve_validators_view, name='validator'),
#     path('validators/delete/<int:pk>', delete_validators_view, name='delete_validator'),
# ]