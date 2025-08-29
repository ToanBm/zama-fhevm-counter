"use client";

import { useMetaMaskEthersSigner } from "../../hooks/metamask/useMetaMaskEthersSigner";
import { useState, useEffect } from "react";

export const ConnectWallet = () => {
  const {
    accounts,
    isConnected,
    connect,
    disconnect,
    chainId,
    provider,
  } = useMetaMaskEthersSigner();

  const [showDropdown, setShowDropdown] = useState(false);

  // Auto switch to Sepolia when connected
  useEffect(() => {
    if (isConnected && provider && chainId !== 11155111) {
      setTimeout(() => {
        switchToSepolia();
      }, 500);
    }
  }, [isConnected, provider, chainId]);

  const handleCopyAddress = async () => {
    if (accounts?.[0]) {
      try {
        await navigator.clipboard.writeText(accounts[0]);
        setShowDropdown(false);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  const switchToSepolia = async () => {
    if (!provider) return;
    
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // 11155111 in hex
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added, add it
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xaa36a7',
            chainName: 'Sepolia',
            nativeCurrency: {
              name: 'Sepolia Ether',
              symbol: 'SEP',
              decimals: 18,
            },
            rpcUrls: ['https://rpc.sepolia.org'],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          }],
        });
      }
    }
  };

  if (!isConnected) {
    return (
      <button 
        className="connect-button" 
        onClick={async () => {
          try {
            await connect();
          } catch (error) {
            console.error('Failed to connect:', error);
          }
        }}
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="connect-wallet-container">
      <button 
        className="connect-button connected" 
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {`${accounts?.[0]?.slice(0, 6)}...${accounts?.[0]?.slice(-4)}`}
      </button>
      
      {showDropdown && (
        <div className="connect-dropdown">
          <button 
            className="dropdown-item"
            onClick={handleCopyAddress}
          >
            Copy Address
          </button>
        </div>
      )}
    </div>
  );
};
