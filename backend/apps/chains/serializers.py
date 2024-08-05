from rest_framework import serializers
from .models import AutonityNetworks as Chain

class ChainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chain
        fields = '__all__'

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
