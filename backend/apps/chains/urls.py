from django.urls import path
from .views import ChainCreateView, ChainListView,ChainDetailView,ChainUpdateView,ChainDeleteView

urlpatterns = [
  path('chains/', ChainListView.as_view(), name='list-chains'),
  path('chains/create/', ChainCreateView.as_view(), name='create-chain'),
  path('chains/<int:chain_id>/', ChainDetailView.as_view(), name='detail-chain'),
  path('chains/<int:chain_id>/update/', ChainUpdateView.as_view(), name='update-chain'),
  path('chains/<int:chain_id>/delete/', ChainDeleteView.as_view(), name='delete-chain'),
]