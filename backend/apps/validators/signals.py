from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Validator, ValidatorHistory

@receiver(pre_save, sender=Validator)
def save_validator_history(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_instance = Validator.objects.get(pk=instance.pk)
            ValidatorHistory.objects.create(
                validator_id=old_instance,
                chain_id=old_instance.chain_id,
                validator_name=old_instance.validator_name,
                node_address=old_instance.node_address,
                treasury=old_instance.treasury,
                commission_rate=old_instance.commission_rate,
                voting_power=old_instance.voting_power,
                bonded_stake=old_instance.bonded_stake,
                total_slashed=old_instance.total_slashed,
                state=old_instance.state,
                oracle_address=old_instance.oracle_address,
                enode=old_instance.enode,
                consensus_key=old_instance.consensus_key,
                provable_fault_count=old_instance.provable_fault_count,
                self_unbonding_stake=old_instance.self_unbonding_stake,
                self_unbonding_shares=old_instance.self_unbonding_shares,
                self_unbonding_stake_locked=old_instance.self_unbonding_stake_locked,
                unbonding_stake=old_instance.unbonding_stake,
                unbonding_shares=old_instance.unbonding_shares,
                liquid_contract=old_instance.liquid_contract,
                liquid_supply=old_instance.liquid_supply,
                jail_release_block=old_instance.jail_release_block
            )
        except Validator.DoesNotExist:
            pass
