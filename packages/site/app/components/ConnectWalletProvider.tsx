"use client";

import { MetaMaskProvider } from "../../hooks/metamask/useMetaMaskProvider";
import { MetaMaskEthersSignerProvider } from "../../hooks/metamask/useMetaMaskEthersSigner";
import { ConnectWallet } from "./ConnectWallet";

export const ConnectWalletProvider = () => {
  return (
    <MetaMaskProvider>
      <MetaMaskEthersSignerProvider initialMockChains={{}}>
        <ConnectWallet />
      </MetaMaskEthersSignerProvider>
    </MetaMaskProvider>
  );
};
