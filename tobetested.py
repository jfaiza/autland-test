from autonity.utils.web3 import create_web3_for_endpoint
from autonity import Autonity, Validator, liquid_newton
from autonity.utils.tx import create_transaction




# # Connect to your Ethereum node (if necessary)
# w3 = Web3(Web3.HTTPProvider("http://YOUR_NODE_URL"))  # Replace with your provider URL

# # Convert wei to ether
# eth_value = w3.utils.from_wei(wei_value, 'ether')

# # Print the ETH value
# print(f"{wei_value} wei is equal to {eth_value} ether")









# w3 = create_web3_for_endpoint("https://rpc1.piccadilly.autonity.org/")
w3 = create_web3_for_endpoint("https://rpc1.bakerloo.autonity.org/")

# Create the typed wrapper around the Autonity contract.
autonity = Autonity(w3)

name = autonity.name()
print(f"Name: {name}")
print(create_transaction(to_addr='x', value=10000000, ))

address = autonity.address()
print(f"Address: {address}")

# Get total supply of Newton
ntn_supply = autonity.total_supply()
print(f"Total supply of Newton: {ntn_supply}")

# Get balance of Newton for <ADDRESS>
ntn_balance = autonity.balance_of("0xFD32bD07c0BD6bf1802De9c93B0Be97799c11EFb")
print(f"Balance of Newton for <ADDRESS>: {ntn_balance}")

# Get the current validator list
validator_ids = autonity.get_validators()
print(f"Validators: {len(validator_ids)}")


# Get descriptor for the 0-th validator.  Print LNTN contract address.
validator_desc_0 = autonity.get_validator(validator_ids[-3])
print(f"LNTN contract addr: {validator_desc_0['liquid_supply']}")
print(validator_desc_0)
print('------------------------------------------')
for address in validator_ids:
    validator = Validator(w3, autonity.get_validator(address))
    print('unclaimed rewards: ', liquid_newton.LiquidNewton.unclaimed_rewards(validator._liquid_contract, address))
    print('claimed rewards: ', liquid_newton.LiquidNewton.claim_rewards(validator._liquid_contract))
    print('State: ', validator.state.name)
    print('Total Stake: ',w3.from_wei(validator.liquid_supply, 'ether'))
    print('Bounded stake: ', w3.from_wei(validator.self_bonded_stake, 'ether'))
    print('Fee: ', validator.commission_rate // 100, '%')
    print('Total Slashed: ', w3.from_wei(validator.total_slashed, 'ether'))
    # print('')
    print('------------------------------------------')

# # Typed validator Liquid Newton contract.  Query unclaimed fees for <ADDRESS>.
# validator = Validator(w3, validator_desc_0)
# unclaimed_rewards = validator.state
# print(f"unclaimed rewards: {unclaimed_rewards}")