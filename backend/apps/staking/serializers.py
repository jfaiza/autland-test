from rest_framework import serializers
from .models import Staking

class StakingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staking
        fields = '__all__'
        read_only_fields = ['created', 'updated', 'id']
