"use client";

import { useMetaMaskEthersSigner } from "../../hooks/metamask/useMetaMaskEthersSigner";
import { useState } from "react";

export const ConnectWallet = () => {
  const {
    accounts,
    isConnected,
    connect,
  } = useMetaMaskEthersSigner();

  const [showDropdown, setShowDropdown] = useState(false);

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

  if (!isConnected) {
    return (
      <button 
        className="connect-button" 
        onClick={connect}
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
