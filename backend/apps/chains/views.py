from rest_framework import generics, status
from rest_framework.response import Response
from .models import AutonityNetworks as Chain
from .serializers import ChainSerializer
from ..user.permissions import IsProjectOwner

class ChainCreateView(generics.CreateAPIView):
  queryset = Chain.objects.all()  # Use the Chain model queryset
  serializer_class = ChainSerializer
  permission_classes = [IsProjectOwner]

  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    self.perform_create(serializer)
    headers = self.get_success_headers(serializer.data)
    return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class ChainListView(generics.ListAPIView):
  queryset = Chain.objects.all()  # Use the Chain model queryset
  serializer_class = ChainSerializer

class ChainDetailView(generics.RetrieveAPIView):
  queryset = Chain.objects.all()
  serializer_class = ChainSerializer

class ChainUpdateView(generics.UpdateAPIView):
    queryset = Chain.objects.all()
    serializer_class = ChainSerializer
    permission_classes = [IsProjectOwner]
    lookup_field = 'chain_id'

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

class ChainDeleteView(generics.DestroyAPIView):
    queryset = Chain.objects.all()
    serializer_class = ChainSerializer
    permission_classes = [IsProjectOwner]
    lookup_field = 'chain_id'