import { bond_handler } from "../api/validators/utils/stake.utils";
import { useChainStore } from "@/store";

export function SendTransactionButton({ from, to, amount, sendTransaction, isPending }) {
    const { selectedChain } = useChainStore();
    const handleGenerateTx = async () => {
      const transaction = await bond_handler({ from, to, amount, chain:selectedChain });
      sendTransaction(transaction);
    };
    return (
      <>
        <button
          className="bg-cyan-600 text-white px-6 rounded-[0.5rem] h-8 ml-auto"
          onClick={() => {
            handleGenerateTx();
          }}
          disabled={isPending}
        >
          {isPending ? "Sending..." : "Submit"}
        </button>
      </>
    );
  }


  


// import React from 'react';
// import { useAccount, useNetwork, useSwitchNetwork, useSendTransaction } from 'wagmi';
// import { ethers } from 'ethers';

// const MyComponent = () => {
//   const { address } = useAccount();
//   const { chain } = useNetwork();
//   const { switchNetwork } = useSwitchNetwork();
//   const { sendTransaction } = useSendTransaction();

//   const targetChainId = 65100003; // Replace with your desired chain ID
//   const targetChainParams = {
//     chainId: '0x3e84003', // Replace with the hex value of the chain ID
//     chainName: 'My Custom Network',
//     nativeCurrency: {
//       name: 'Custom Coin',
//       symbol: 'CC', // 2-6 characters long
//       decimals: 18,
//     },
//     rpcUrls: ['https://rpc.mycustomnetwork.io'], // Replace with your RPC URL
//     blockExplorerUrls: ['https://explorer.mycustomnetwork.io'], // Replace with your block explorer URL
//   };

//   const handleAddChainAndSendTransaction = async () => {
//     if (chain.id !== targetChainId) {
//       try {
//         await switchNetwork(targetChainId);
//       } catch (error) {
//         console.error('Error switching network:', error);
//         if (error.code === 4902) {
//           try {
//             await window.ethereum.request({
//               method: 'wallet_addEthereumChain',
//               params: [targetChainParams],
//             });
//             await switchNetwork(targetChainId);
//           } catch (addError) {
//             console.error('Error adding network:', addError);
//             return;
//           }
//         }
//       }
//     }

//     const transaction = {
//       to: '0xBd770416a3345F91E4B34576cb804a576fa48EB1',
//       value: ethers.utils.parseEther('0.01'),
//       data: '0xa515366a000000000000000000000000b50dfb9bec0560c802454f7fff65a2c3a0cf46ea00000000000000000000000000000000000000000000000000038d7ea4c68000',
//       gasLimit: ethers.utils.hexlify(2000000),
//       gasPrice: ethers.utils.parseUnits('50', 'gwei'),
//     };

//     sendTransaction({ request: transaction });
//   };

//   return (
//     <div>
//       <button onClick={handleAddChainAndSendTransaction}>Send Transaction</button>
//     </div>
//   );
// };

// export default MyComponent;
