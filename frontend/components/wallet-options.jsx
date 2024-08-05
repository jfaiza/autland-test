import * as React from "react";
import { useConnect } from "wagmi";
import Modal from "./Modal";
import { AutonityLogo, MetamaskIcon, TrustWalletIcon } from "@/components/svg";
import ConnectWallet from "@/components/ui/connect-button";

export function WalletOptions() {
  const { connectors, connect } = useConnect();
  const [isOpen, setIsOpen] = React.useState(false);
  const [userHasMetamask, setUserHasMetamask] = React.useState(false);
  const [userHasTrustWallet, setUserHasTrustWallet] = React.useState(false);

  const filteredConnectors = React.useMemo(
    () =>
      connectors.filter(
        (connector) =>
          connector.name === "MetaMask" || connector.name === "Trust Wallet"
      ),
    [connectors]
  );

  const walletOptions = React.useMemo(() => {
    const options = new Map();

    filteredConnectors.forEach((connector) => {
      if (!options.has(connector.name)) {
        options.set(connector.name, connector);
      }
    });

    return Array.from(options.values());
  }, [filteredConnectors]);

  React.useEffect(() => {
    if (typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask) {
      setUserHasMetamask(true);
    }

    filteredConnectors.forEach((connector) => {
      if (connector.name === "Trust Wallet") setUserHasTrustWallet(true);
    });
  }, [filteredConnectors, connectors]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div className="flex items-center justify-center">
      <ConnectWallet clickFunction={openModal} title={"Connect"} />

      <Modal isOpen={isOpen} closeModal={closeModal}>
        <span className="text-xl font-bold">Connect Wallet</span>
        <div className="flex space-x-8 mt-10">
          <div className="flex flex-col space-y-6">
            {!userHasMetamask && (
              <button
                key={"connect"}
                disabled={!userHasMetamask}
                className={`flex items-center space-x-4 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out h-10 w-40
                    ${userHasMetamask ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
              >
                <MetamaskIcon width={24} height={24} />
                <span>{"Metamask"}</span>
              </button>
            )}
            {walletOptions.map((connector) => {
              const isMetaMask = connector.name === "MetaMask";
              const isTrustWallet = connector.name === "Trust Wallet";
              const isEnabled =
                (isMetaMask && userHasMetamask) ||
                (isTrustWallet && userHasTrustWallet);

              return (
                <button
                  key={connector.uid}
                  onClick={() => {
                    if (isEnabled) {
                      connect({ connector });
                      closeModal();
                    }
                  }}
                  disabled={!isEnabled}
                  className={`flex items-center space-x-4 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out h-10 w-40
                  ${isEnabled ? "hover:bg-gray-500 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
                >
                  {isMetaMask ? (
                    <MetamaskIcon width={24} height={24} />
                  ) : (
                    <TrustWalletIcon width={24} height={24} />
                  )}
                  <span>{connector.name}</span>
                </button>
              );
            })}
            {!userHasTrustWallet && (
              <button
                key={"uid"}
                disabled={!userHasTrustWallet}
                className={`flex items-center space-x-4 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out h-10 w-40
                    ${userHasTrustWallet ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-gray-900 text-gray-200 cursor-not-allowed"}`}
              >
                <TrustWalletIcon width={24} height={24} />
                <span>{"Trust Wallet"}</span>
              </button>
            )}
          </div>
          <div className="flex flex-col items-center justify-center text-white w-full -mt-6 -pt-6">
            <span>
                <AutonityLogo width={150} height={150} />
            </span>
            <span className="text-xl font-bold pt-4">Welcome!</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
