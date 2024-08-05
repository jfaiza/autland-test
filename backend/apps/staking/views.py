from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .serializers import StakingSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Staking

class StakingViewSet(viewsets.ModelViewSet):
    allowed_methods = ["GET"]
    queryset = Staking.objects.all()
    serializer_class = StakingSerializer
    permission = [AllowAny]
    
    # @action(methods=['GET'], detail=False)
    # def get_all_staking(self, request, *args, **kwargs):
    #     staking = Staking.objects.all()
    #     serializer = StakingSerializer(staking, many=True)
    #     return Response(serializer.data)