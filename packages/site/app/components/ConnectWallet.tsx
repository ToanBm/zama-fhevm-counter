"use client";

import { useMetaMaskEthersSigner } from "../../hooks/metamask/useMetaMaskEthersSigner";
import { useState, useEffect, useCallback, useRef } from "react";

export const ConnectWallet = () => {
  const {
    accounts,
    isConnected,
    connect,
    chainId,
    provider,
  } = useMetaMaskEthersSigner();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const switchToSepolia = useCallback(async () => {
    if (!provider) return;
    
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // 11155111 in hex
      });
    } catch (error: unknown) {
      if (typeof error === 'object' && error && 'code' in error && error.code === 4902) {
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
  }, [provider]);

  // Auto switch to Sepolia when connected
  useEffect(() => {
    if (isConnected && provider && chainId !== 11155111) {
      setTimeout(() => {
        switchToSepolia();
      }, 500);
    }
  }, [isConnected, provider, chainId, switchToSepolia]);

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
        <div className="connect-dropdown" ref={dropdownRef}>
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
