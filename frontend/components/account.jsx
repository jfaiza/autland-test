import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import CopyComponent from "@/components/ui/hover-disconnect";
import ConnectWallet from "@/components/ui/connect-button";

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name });

  return (
    <div>
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && (
        <div>
          {ensName ? (
            `${ensName} (${address})`
          ) : (
            <ConnectWallet
              clickFunction={() => disconnect()}
              title={
                <CopyComponent
                  pts="..."
                  left={4}
                  right={-4}
                  address={address}
                />
              }
            />
          )}
        </div>
      )}
      {/* Disconnect */}
    </div>
  );
}
