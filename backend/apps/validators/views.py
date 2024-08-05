from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import BooleanField, FloatField, F, ExpressionWrapper, Value
from django.db.models.functions import Cast
from rest_framework.response import Response
from .models import Validator, ValidatorInfo
from .serializers import ValidatorSerializer, ValidatorInfoSerializer
from django.shortcuts import get_object_or_404
from .utils import loadValidators
from datetime import datetime, timedelta
from .utils import save_old_data_manually
from autonity.utils.web3 import create_web3_for_endpoint, Web3WithAutonity
import autonity.abi as abi 
import json
from autonity.autonity import AUTONITY_CONTRACT_ADDRESS, get_autonity_contract_abi_path
from ..chains.models import AutonityNetworks as Chain
# from autonity import Validator as Aut_Validator
from autonity import Autonity

class ValidatorsListView(generics.ListAPIView):
    queryset = ValidatorInfo.objects.all()
    serializer_class = ValidatorInfoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        try:
            [_, chainID] = self.request.query_params.getlist('chain[]')
            filtred = set(['validatorhistory', 'commission_rate_history', 'voting_power_history', 'bonded_stake_history'])
            field_names = [field.name for field in ValidatorInfo._meta.get_fields() if field.name not in filtred]
            queryset = ValidatorInfo.objects.filter(chain_id=chainID).annotate(
                bonded_stake_float=Cast('bonded_stake', FloatField()),
                voting_power_float=Cast('voting_power', FloatField()),
                bonded_stake_divided=ExpressionWrapper(F('bonded_stake_float') / 1, output_field=FloatField()),
                voting_power_divided=ExpressionWrapper(F('voting_power_float') / 1, output_field=FloatField()),
            ).order_by('-bonded_stake_float', '-voting_power_float').values('bonded_stake_divided', 'voting_power_divided', *field_names)
            queryset_list = list(queryset)
            # Assign new ids
            for idx, item in enumerate(queryset_list, start=1):
                item['id'] = idx
                # NB : si self bonded >= 25% du Total satacked >> donc 100% 
                item['covered'] = float(item['bonded_stake']) >= (float(item['self_bonded_stake']) * 0.25)
                if float(item['bonded_stake']) == 0:
                    item['covered'] = False

            return queryset_list

        except Exception as e:
            print(e, 36)
            return []


class ValidatorsDetailsListView(generics.ListAPIView):
    queryset = Validator.objects.all()
    serializer_class = ValidatorSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            [_, chainID] = self.request.query_params.getlist('chain[]')
            node_address = self.request.query_params.get('node_address')
            filtred = ['bonded_stake_history','id', 'covered', 'bonded_stake', 'self_bonded_stake']
            item = Validator.objects.filter(
                node_address=node_address, chain_id=chainID
            ).values(*filtred).first()

            def get_date_from_x_days_ago(days_ago):
                today = datetime.today()
                past_date = today - timedelta(days=days_ago)
                return past_date.isoformat()

            # NB : si self bonded >= 25% du Total satacked >> donc 100% 
            item['covered'] = float(item['bonded_stake']) >= (float(item['self_bonded_stake']) * 0.25)
            if float(item['bonded_stake']) == 0:
                item['covered'] = False
            print(item['covered'], item['bonded_stake'])
            item['id'] = 1
            item['bonded_stake_history'] = item['bonded_stake_history'][-365:]
            if len(item['bonded_stake_history']) < 365:
                size = len(item['bonded_stake_history'])
                count = 365 - size
                tmp = [{
                    'time': get_date_from_x_days_ago(count-c+size-1),
                    'value': 0
                } for c in range(count)]
                if len(tmp) > 20:
                    tmp = tmp[-20:]
                item['bonded_stake_history'] = tmp + item['bonded_stake_history']
            return Response(item, status=status.HTTP_201_CREATED)


        except Exception as e:
            print(e, 36)
            return Response([], status=status.HTTP_503_SERVICE_UNAVAILABLE)


class ValidatorDetailAPIView(generics.RetrieveAPIView):
    queryset = Validator.objects.all()
    serializer_class = ValidatorSerializer

    def get_object(self):
        queryset = self.get_queryset()
        chain_params = self.request.query_params.getlist('chain[]')
        node_address = self.request.query_params.get('node_address')
        if len(chain_params) == 2:
            _, chainID = chain_params
        else:
            chainID = None

        if node_address and chainID:
            validator = get_object_or_404(queryset, node_address=node_address, chain_id=chainID)
            validator.covered = float(validator.bonded_stake) >= (float(validator.self_bonded_stake) * 0.25)
            if float(validator.bonded_stake) == 0:
                validator.covered = False
            return validator
        return None
class ValidatorsDestroyAllView(generics.GenericAPIView):
    queryset = Validator.objects.all()

    def delete(self, request, *args, **kwargs):
        # Perform the bulk delete operation
        self.get_queryset().delete()
        return Response({"message": "All validators have been deleted."}, status=status.HTTP_204_NO_CONTENT)




from datetime import datetime
from rest_framework import generics, status
from rest_framework.response import Response

class ValidatorsLatesUpdatetView(generics.ListCreateAPIView):
    serializer_class = ValidatorSerializer
    model = Validator
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Validator.objects.all()

    def get(self, request, *args, **kwargs):
        print('=============================')
        print('Start Fetch validators !!!')

        validators_data = loadValidators()
        output = []
        try:
            for validator_data in validators_data:
                node_address = validator_data.get('node_address')
                treasury = validator_data.get('treasury')
                chain_id = validator_data.get('chain_id')
                if not node_address or not treasury:
                    continue  # Skip this iteration if either id or treasury is missing
                try:
                    instance = Validator.objects.filter(
                        node_address=node_address, treasury=treasury, chain_id=chain_id
                    ).first()
                    if not instance:
                        serializer = self.get_serializer(data=validator_data, partial=True)
                        serializer.is_valid(raise_exception=True)
                        new_validator = serializer.save()
                        output.append(serializer.data)
                        instance = new_validator

                    instance_info, created = ValidatorInfo.objects.get_or_create(
                        node_address=node_address, treasury=treasury, chain_id=chain_id
                    )

                    if created:
                        validator_info_serializer = ValidatorInfoSerializer(instance_info, data=validator_data, partial=True)
                    else:
                        validator_info_serializer = ValidatorInfoSerializer(instance_info, data=validator_data, partial=True)
                    validator_info_serializer.is_valid(raise_exception=True)
                    validator_info_serializer.save()
                    output.append(validator_info_serializer.data)

                    instance_info.covered = float(instance_info.self_bonded_stake) >= (float(instance_info.bonded_stake) * 0.25)

                    if len(instance.commission_rate_history) > 0:
                        last_time = instance.commission_rate_history[-1].get('time')

                    def can_update_field(last_update_time):
                        if not last_update_time:
                            return True
                        current_date = datetime.now().date()
                        last_update_date = datetime.fromisoformat(last_update_time).date()
                        return current_date > last_update_date
                    can_update = can_update_field(last_time)
                    if can_update:
                        save_old_data_manually(instance)
                        validator_data['commission_rate_history'] = instance.commission_rate_history + validator_data['commission_rate_history']
                        validator_data['voting_power_history'] = instance.voting_power_history + validator_data['voting_power_history']
                        validator_data['bonded_stake_history'] = instance.bonded_stake_history + validator_data['bonded_stake_history']
                        validator_data['self_bonded_stake_history'] = instance.self_bonded_stake_history + validator_data['self_bonded_stake_history']
                        validator_data['delegated_stake_history'] = instance.delegated_stake_history + validator_data['delegated_stake_history']
                        validator_data['total_slashed_history'] = instance.total_slashed_history + validator_data['total_slashed_history']
                    else:
                        validator_data['commission_rate_history'] = instance.commission_rate_history
                        validator_data['voting_power_history'] = instance.voting_power_history
                        validator_data['bonded_stake_history'] = instance.bonded_stake_history
                        validator_data['self_bonded_stake_history'] = instance.self_bonded_stake_history 
                        validator_data['delegated_stake_history'] = instance.delegated_stake_history 
                        validator_data['total_slashed_history'] = instance.total_slashed_history
                    # print('working on address: ', node_address)
                    # print('located in : ', chain_id)
                    def fill_missing_entries(data):
                        print('start filling missing data')
                        history_keys = [
                            'commission_rate_history',
                            'voting_power_history',
                            'bonded_stake_history',
                            'self_bonded_stake_history',
                            'delegated_stake_history',
                            'total_slashed_history'
                        ]

                        # Determine the maximum length of history arrays
                        max_length = max(len(data[key]) for key in history_keys)

                        # Fill missing entries
                        for key in history_keys:
                            last_entry = data[key][-1]
                            last_value = last_entry['value']
                            last_time = datetime.fromisoformat(last_entry['time'])

                            # Generate missing entries
                            while len(data[key]) < max_length:
                                last_time = last_time.replace(second=last_time.second + 1)
                                new_entry = {
                                    'time': last_time.isoformat(),
                                    'value': 0
                                }
                                data[key].insert(0, new_entry)
                        return data
                    # try: 
                    #     validator_data = fill_missing_entries(validator_data)
                    # except:
                    #     print('Error from filling data ')
                    serializer = self.get_serializer(instance, data=validator_data, partial=True)
                    serializer.is_valid(raise_exception=True)
                    serializer.save()
                    output.append(serializer.data)

                    instance_info.save()

                except Validator.DoesNotExist:

                    serializer = self.get_serializer(data=validator_data, partial=True)
                    serializer.is_valid(raise_exception=True)
                    self.perform_create(serializer)
                    output.append(serializer.data)
        except Exception as e:
            print(e.args, 'from ValidatorsLatesUpdatetView')

        print('=============================')
        print('Fetch validators successfully')
        print('=============================')
        return Response(output, status=status.HTTP_201_CREATED)
class ValidatorsUpdateHistoryData(generics.ListCreateAPIView):
    queryset = Validator.objects.all()
    serializer_class = ValidatorSerializer


    def get(self, request, *args, **kwargs):
        def consolidate_history(history_list):
            # Convert list of dictionaries to list of objects for easier handling
            history_entries = [entry for entry in history_list]
            history_by_date = {}

            for entry in history_entries:
                date = datetime.strptime(entry['time'], "%Y-%m-%dT%H:%M:%S.%f").date()

                if date not in history_by_date:
                    history_by_date[date] = entry
                else:
                    if entry['time'] > history_by_date[date]['time']:
                        history_by_date[date] = entry

            return list(history_by_date.values())

        try:
            for validator in self.get_queryset():
                # Get history fields
                commission_rate_history = validator.commission_rate_history
                voting_power_history = validator.voting_power_history
                bonded_stake_history = validator.bonded_stake_history

                # Consolidate histories
                validator.commission_rate_history = consolidate_history(commission_rate_history)
                validator.voting_power_history = consolidate_history(voting_power_history)
                validator.bonded_stake_history = consolidate_history(bonded_stake_history)

                # Save the updated validator
                validator.save()

            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e.args, 'from ValidatorsUpdateHistoryData')
            return Response(status=status.HTTP_400_BAD_REQUEST)



# class ValidatorsListCreateView(generics.ListCreateAPIView):
#     queryset = Validators.objects.all()
#     serializer_class = ValidatorsSerializer
#     permission_classes = [IsAuthenticated]

#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

# class ValidatorsCustomPostView(generics.CreateAPIView):
#     serializer_class = ValidatorsSerializer

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class ValidatorsRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Validators.objects.all()
#     serializer_class = ValidatorsSerializer

#     def retrieve(self, request, *args, **kwargs):
#         instance = get_object_or_404(Validators, pk=kwargs['pk'])
#         serializer = self.get_serializer(instance)
#         return Response(serializer.data)

#     def destroy(self, request, *args, **kwargs):
#         instance = self.get_object()
#         instance.delete()
#         serializer = self.get_serializer(instance)
#         return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)


# class ValidatorsRetrieveView(generics.RetrieveAPIView):
#     queryset = Validators.objects.all()
#     serializer_class = ValidatorsSerializer

#     def retrieve(self, request, *args, **kwargs):
#         instance = get_object_or_404(Validators, pk=kwargs['pk'])
#         serializer = self.get_serializer(instance)
#         return Response(serializer.data)


# class ValidatorsLatestView(generics.ListAPIView):
#     serializer_class = ValidatorsSerializer

#     def get_queryset(self):
#         return [Validators.objects.latest('created_at')]











# from rest_framework import viewsets, status
# from rest_framework.permissions import AllowAny
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from rest_framework.exceptions import NotFound
# from django.shortcuts import get_object_or_404
# from .models import Validators
# from .serializers import ValidatorsSerializer
# from rest_framework.exceptions import MethodNotAllowed

# class ValidatorsViewSet(viewsets.ModelViewSet):
#     queryset = Validators.objects.all()
#     serializer_class = ValidatorsSerializer
#     permission_classes = [AllowAny]  # Fixed permission typo

#     @action(detail=False, methods=['get'])
#     def list_view(self, request):
#         queryset = self.filter_queryset(self.get_queryset())
#         serializer = self.get_serializer(queryset, many=True)
#         return Response(serializer.data)

#     @action(detail=False, methods=['get'])
#     def latest(self, request):
#         latest_validator = Validators.objects.latest('created_at')
#         serializer = self.get_serializer(latest_validator)
#         return Response(serializer.data)

#     def retrieve(self, request, *args, **kwargs):
#         instance = get_object_or_404(Validators, pk=kwargs['pk'])
#         serializer = self.get_serializer(instance)
#         return Response(serializer.data)

#     def destroy(self, request, *args, **kwargs):
#         instance = self.get_object()
#         instance.delete()
#         serializer = self.get_serializer(instance)
#         return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)

#     @action(detail=False, methods=['post'])
#     def custom_post(self, request):
#         serializer = ValidatorsSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class ValidatorsViewSet(NoListMixin, viewsets.ModelViewSet):
# class NoListMixin:
#     def list(self, request, *args, **kwargs):
#         raise MethodNotAllowed('GET')
#     def create(self, request, *args, **kwargs):
#         raise MethodNotAllowed('POST')

#     def update(self, request, *args, **kwargs):
#         raise MethodNotAllowed('PUT')

#     def partial_update(self, request, *args, **kwargs):
#         raise MethodNotAllowed('PATCH')

#     def destroy(self, request, *args, **kwargs):
#         raise MethodNotAllowed('DELETE')
    
    









# from rest_framework import viewsets, status
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from .models import Validators
# from .serializers import ValidatorsSerializer

# class ValidatorsViewSet(viewsets.ModelViewSet):
#     queryset = Validators.objects.all()
#     serializer_class = ValidatorsSerializer

#     @action(detail=False, methods=['get'], url_path='list')
#     def list_view(self, request):
#         queryset = self.filter_queryset(self.get_queryset())
#         serializer = self.get_serializer(queryset, many=True)
#         return Response(serializer.data)

#     @action(detail=False, methods=['post'], url_path='create')
#     def create_view(self, request):
#         serializer = self.get_serializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     @action(detail=True, methods=['put'], url_path='update/(?P<pk>[^/.]+)')
#     def update_view(self, request, pk=None):
#         instance = self.get_object()
#         serializer = self.get_serializer(instance, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     @action(detail=True, methods=['patch'], url_path='partial_update/(?P<pk>[^/.]+)')
#     def partial_update_view(self, request, pk=None):
#         instance = self.get_object()
#         serializer = self.get_serializer(instance, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     @action(detail=True, methods=['delete'], url_path='delete/(?P<pk>[^/.]+)')
#     def destroy_view(self, request, pk=None):
#         instance = self.get_object()
#         instance.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

class StakeView(generics.RetrieveAPIView):

    def get(self, request, *args, **kwargs):

        amount = request.query_params.get('amount')
        address = request.query_params.get('address')
        chain_params = request.query_params.getlist('chain[]')

        if len(chain_params) == 2:
            _, chainID = chain_params
        else:
            chainID = None
        
        chain_rpc = Chain.objects.get(chain_id=chainID).rpc_url
        function_name = 'bond'
        function_args = (address,  int(amount))
        print(chain_rpc)
        w3 = create_web3_for_endpoint(chain_rpc)

        with open(get_autonity_contract_abi_path(), 'r') as abi_file:
            contract_abi = json.load(abi_file)

        autonity_address = AUTONITY_CONTRACT_ADDRESS

        contract = w3.eth.contract(address=autonity_address, abi=contract_abi)

        contract_function = contract.functions[function_name](*function_args)

        gas_price = w3.to_wei('50', 'gwei')
        gas = 2000000  # Estimate or set a sufficient gas limit

        # Build the transaction
        transaction = contract_function.build_transaction({
            'gas': w3.to_hex(gas),
            'gasPrice': w3.to_hex(gas_price),
        })

        return Response(transaction, status=status.HTTP_200_OK)





class DashboardValidators(generics.RetrieveAPIView):
    queryset = ValidatorInfo.objects.all()
    serializer_class = ValidatorInfoSerializer
    model = ValidatorInfo

    def get(self, request, *args, **kwargs):
        try:

            chain_params = request.query_params.getlist('chain[]')

            if len(chain_params) == 2:
                _, chainID = chain_params
            else:
                chainID = None
            
            chain_rpc = Chain.objects.get(chain_id=chainID).rpc_url

            w3 = create_web3_for_endpoint(chain_rpc)
            autonity = Autonity(w3)
            total_supply = str(w3.from_wei(int(autonity.total_supply()), 'ether'))
            committee_size = autonity.get_max_committee_size()

            output = {}
            output['committee'] = int(committee_size)
            output['committee_autonity'] = int(committee_size)
            output['paused'] = 0
            output['jailed'] = 0
            output['jailbond'] = 0
            output['bonded_stake'] = 0
            output['unbonding_stake'] = 0

            queryset = ValidatorInfo.objects.filter(chain_id=chainID).values()
            queryset_list = list(queryset)
            output['total'] = len(queryset_list)
            output['rest'] = len(queryset_list)
            output['unbonding_period'] = int(autonity.get_unbonding_period()) / 3600

            for idx, item in enumerate(queryset_list, start=1):
                if item['state'] == 'PAUSED' :
                    output['paused'] += 1
                    output['rest'] -= 1
                elif item['state'] == 'JAILED' :
                    output['jailed'] += 1
                    output['rest'] -= 1
                elif item['state'] == 'JAILBOUND' :
                    output['jailbond'] += 1
                    output['rest'] -= 1
                output['bonded_stake'] += float(item['bonded_stake'])
                output['unbonding_stake'] += float(item['unbonding_stake'])
            if output['committee'] > output['total']:
                output['committee'] = output['total']
            output['rest'] -= output['committee']
            output['total_supply'] = float(total_supply)
            output['rest_supply'] = float(total_supply) - output['bonded_stake']

            return Response(output, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)