from autonity import Autonity, Validator
from autonity.utils import tx
from autonity.utils.web3 import create_web3_for_endpoint, Web3WithAutonity
import autonity.abi as abi 
import json
from autonity.autonity import AUTONITY_CONTRACT_ADDRESS, get_autonity_contract_abi_path
print(AUTONITY_CONTRACT_ADDRESS)

# w3 = create_web3_for_endpoint("https://rpc1.piccadilly.autonity.org/")
w3 = create_web3_for_endpoint("https://rpc1.bakerloo.autonity.org/")

with open(get_autonity_contract_abi_path(), 'r') as abi_file:
    contract_abi = json.load(abi_file)

autonity_address = AUTONITY_CONTRACT_ADDRESS

contract = w3.eth.contract(address=autonity_address, abi=contract_abi)

function_name = 'bond'
function_args = ('0x551f3300FCFE0e392178b3542c009948008B2a9F', 1)

# Get the function from the contract
contract_function = contract.functions[function_name](*function_args)

# Prepare the transaction details
# account_address = '0xSenderAddress'
# private_key = 'YOUR_PRIVATE_KEY'
# nonce = w3.eth.getTransactionCount(account_address)
# gas_price = w3.to_wei('50', 'gwei')
# gas = 2000000  # Estimate or set a sufficient gas limit

# # Build the transaction
# transaction = contract_function.build_transaction({
#     # 'chainId': 1,  # Mainnet chain ID
#     'gas': gas,
#     'gasPrice': gas_price,
#     # 'nonce': nonce,
# })
# print('transaction', transaction)






# print('test', contract_abi)
# Create the typed wrapper around the Autonity contract.
autonity = Autonity(w3)

tx = autonity.bond(amount=1, validator_addr="0x551f3300FCFE0e392178b3542c009948008B2a9F").transaction
print('output', tx)

# test = tx.create_contract_function_transaction

