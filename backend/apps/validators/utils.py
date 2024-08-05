from autonity.utils.web3 import create_web3_for_endpoint
from autonity import Autonity, Validator
from autonity.validator import ValidatorState
import backend.apps.delegators.utils as x
from datetime import datetime
from django.db.models.signals import pre_save
from .models import Validator
from .signals import save_validator_history  # Ensure the signal is imported
from ..chains.models import AutonityNetworks as Chain

def get_chain_rpcs():
    chains = Chain.objects.values('rpc_url')
    return [chain['rpc_url'] for chain in chains if chain['rpc_url']]
def get_chain_ids():
    chains = Chain.objects.values('rpc_url', 'chain_id')
    return {chain['rpc_url']: chain['chain_id'] for chain in chains if chain['rpc_url'] and chain['chain_id']}

def loadValidators():
    validators = []
    chains = get_chain_rpcs()
    chains_id = get_chain_ids()
    for chain in chains:
        validators_by_chain = []
        w3 = create_web3_for_endpoint(chain)
        autonity = Autonity(w3)
        committee_size = autonity.get_max_committee_size()
        print('committee_size : ', committee_size, 'chain_rpc : ', chain)
        # Get the current validator list
        validator_addresses = autonity.get_validators()
        for address in validator_addresses:
            validator = autonity.get_validator(address)
            chainId = w3.eth.chain_id
            validator['chain_id'] = chainId
            # ACTIVE = 0
            # PAUSED = 1
            # JAILED = 2
            # JAILBOUND = 3
            validator["state"] = ValidatorState(validator["state"]).name
            validator["commission_rate"] = str(int(validator["commission_rate"]) // 100)  #(10000 = 100%)
            validator["bonded_stake"] = str(w3.from_wei(int(validator["bonded_stake"]), 'ether'))
            validator["self_bonded_stake"] = str(w3.from_wei(int(validator["self_bonded_stake"]), 'ether'))
            validator["unbonding_stake"] = str(w3.from_wei(int(validator["unbonding_stake"]), 'ether'))
            validator["unbonding_shares"] = str(w3.from_wei(int(validator["unbonding_shares"]), 'ether'))
            validator["self_unbonding_stake"] = str(w3.from_wei(int(validator["self_unbonding_stake"]), 'ether'))
            validator["self_unbonding_shares"] = str(w3.from_wei(int(validator["self_unbonding_shares"]), 'ether'))
            validator["self_unbonding_stake_locked"] = str(w3.from_wei(int(validator["self_unbonding_stake_locked"]), 'ether'))
            validator["liquid_supply"] = str(w3.from_wei(int(validator["liquid_supply"]), 'ether'))
            validator["total_slashed"] = str(w3.from_wei(int(validator["total_slashed"]), 'ether'))
            validator['commission_rate_history'] = [{'time': datetime.now().isoformat(),'value':validator['commission_rate']}]
            validator['voting_power_history']= []
            validator['bonded_stake_history'] = [{'time': datetime.now().isoformat(),'value':validator['bonded_stake']}]
            validator['self_bonded_stake_history'] = [{'time': datetime.now().isoformat(),'value':validator['self_bonded_stake']}]
            validator['delegated_stake_history'] = [{'time': datetime.now().isoformat(),'value':str(float(validator['bonded_stake']) - float(validator['self_bonded_stake']))}]
            validator['total_slashed_history'] = [{'time': datetime.now().isoformat(),'value':validator['total_slashed']}]
            validators_by_chain.append(validator)
        validators_by_chain.sort(key=lambda k: float( k['bonded_stake']), reverse=True)
        filtred_by_state = list(filter(lambda k: k['state'] == 'ACTIVE' and k['chain_id'] == int(chains_id[chain]) , validators_by_chain))
        voting_power_total = sum([float(validator["bonded_stake"]) for validator in filtred_by_state[:committee_size]])
        count = 0
        for validator in validators_by_chain:
            # validator["voting_power"] = str(100 * float(validator["bonded_stake"]) / voting_power_total)
            if count < committee_size and validator['state'] == 'ACTIVE':
                validator["voting_power"] = str(round(100 * float(validator["bonded_stake"]) / voting_power_total, 4))
                count += 1
            else:
                validator["voting_power"] = "0"
            validator['voting_power_history']= [{'time': datetime.now().isoformat(),'value':validator["voting_power"]}]
        print('validators_by_chain : ', len(validators_by_chain))
        print('committee_size : ', committee_size)
        validators.extend(validators_by_chain)
    return validators

def save_old_data_manually(instance):
    pre_save.send(sender=Validator, instance=instance)
    # print(ValidatorHistory.objects.all().count())