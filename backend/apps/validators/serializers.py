from rest_framework import serializers
from .models import Validator, ValidatorInfo, ValidatorHistory


class ValidatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Validator
        fields = '__all__'
class ValidatorInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValidatorInfo
        fields = '__all__'


class ValidatorHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ValidatorHistory
        fields = '__all__'


    def update(self, instance, validated_data):

        def array_field(field_name):
            array_field_data = validated_data.pop(f'{field_name}', None)
            # Update the array_field if provided
            if array_field_data is not None:
                instance.field_name.extend(array_field_data)

        array_field('commission_rate_history')
        array_field('voting_power_history')
        array_field('bonded_stake_history')

        # Update the remaining fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance