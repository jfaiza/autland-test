import { http, createConfig } from 'wagmi'
import { base, mainnet, optimism } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = 'a991c7e2e889d6f16a32c8c6bcb37ea3'

export const config = createConfig({
  chains: [mainnet, base],
  ssr: true,
  connectors: [
    // injected(),
    // metaMask(),
    // safe(),
    // walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})