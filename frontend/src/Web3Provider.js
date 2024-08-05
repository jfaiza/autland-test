// "use client";

// import { WagmiConfig, createClient, configureChains } from 'wagmi';
// import { mainnet } from 'wagmi/chains';
// import { publicProvider } from 'wagmi/providers/public';
// import { ConnectKitProvider, getDefaultClient } from 'connectkit';

// const { chains, provider, webSocketProvider } = configureChains(
//   [mainnet],
//   [publicProvider()]
// );

// const client = createClient({
//   autoConnect: true,
//   connectors: getDefaultClient({ appName: 'My App', chains }),
//   provider,
//   webSocketProvider,
// });

// export const Web3Provider = ({ children }) => (
//   <WagmiConfig client={client}>
//     <ConnectKitProvider>
//       {children}
//     </ConnectKitProvider>
//   </WagmiConfig>
// );
