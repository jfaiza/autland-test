from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .utils import contract, w3

class DelegatorRetrieveView(generics.RetrieveAPIView):

    def get(self, request, *args, **kwargs):
        # obj_id = kwargs.get('id')
        amount = request.query_params.get('amount')
        address = request.query_params.get('address')

        function_name = 'bond'
        function_args = (address,  int(amount))

        contract_function = contract.functions[function_name](*function_args)

        gas_price = w3.to_wei('50', 'gwei')
        gas = 2000000  # Estimate or set a sufficient gas limit

        # Build the transaction
        transaction = contract_function.build_transaction({
            'gas': w3.to_hex(gas),
            'gasPrice': w3.to_hex(gas_price),
        })

        # response_data = {
        #     'id': obj_id,
        #     'query_param': query_param,
        #     'message': 'This is custom logic returning data without a model.'
        # }
        
        # Return the response data
        return Response(transaction, status=status.HTTP_200_OK)