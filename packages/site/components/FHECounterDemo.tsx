"use client";

import { useFhevm } from "../fhevm/useFhevm";
import { useInMemoryStorage } from "../hooks/useInMemoryStorage";
import { useMetaMaskEthersSigner } from "../hooks/metamask/useMetaMaskEthersSigner";
import { useFHECounter } from "@/hooks/useFHECounter";
import { errorNotDeployed } from "./ErrorNotDeployed";

/*
 * Main FHECounter React component with 3 buttons
 *  - "Decrypt" button: allows you to decrypt the current FHECounter count handle.
 *  - "Increment" button: allows you to increment the FHECounter count handle using FHE operations.
 *  - "Decrement" button: allows you to decrement the FHECounter count handle using FHE operations.
 */
export const FHECounterDemo = () => {
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  const {
    provider,
    chainId,
    accounts,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
    initialMockChains,
  } = useMetaMaskEthersSigner();

  //////////////////////////////////////////////////////////////////////////////
  // FHEVM instance
  //////////////////////////////////////////////////////////////////////////////

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true, // use enabled to dynamically create the instance on-demand
  });

  //////////////////////////////////////////////////////////////////////////////
  // useFHECounter is a custom hook containing all the FHECounter logic, including
  // - calling the FHECounter contract
  // - encrypting FHE inputs
  // - decrypting FHE handles
  //////////////////////////////////////////////////////////////////////////////

  const fheCounter = useFHECounter({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage, // is global, could be invoked directly in useFHECounter hook
    eip1193Provider: provider,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  });

  //////////////////////////////////////////////////////////////////////////////
  // UI Stuff:
  // --------
  // A basic page containing
  // - A bunch of debug values allowing you to better visualize the React state
  // - 1x "Decrypt" button (to decrypt the latest FHECounter count handle)
  // - 1x "Increment" button (to increment the FHECounter)
  // - 1x "Decrement" button (to decrement the FHECounter)
  //////////////////////////////////////////////////////////////////////////////

  const buttonClass = "fhe-action-button";

  const titleClass = "fhe-section-title";



  if (fheCounter.isDeployed === false) {
    return errorNotDeployed(chainId);
  }

  return (
    <div className="main">
      <div className="counter-container">
        {/* Header Section */}
        

        {/* Main Section */}
        <div className="counter-main">
          {/* FHEVM & Status */}
          <div className="status-grid">
            <div className="info-card">
              <h2 className={titleClass}>FHEVM Instance</h2>
              {printProperty(
                "Instance",
                fhevmInstance ? "Active" : "Inactive",
                fhevmInstance ? "success" : "error"
              )}
              {printProperty("State", fhevmStatus, fhevmStatus === "ready" ? "success" : "error")}
              {printProperty("Error Log", fhevmError ?? "None", !fhevmError ? "success" : "error")}
            </div>
            
            {/* Network & Contract */}
            <div className="info-card">
              <h2 className={titleClass}>Network & Contract</h2>
              {printProperty("Network", getNetworkName(chainId), "success")}
              {printProperty(
                "Wallet",
                accounts
                  ? accounts.length === 0
                    ? "No accounts"
                    : `${accounts.length} account${accounts.length > 1 ? 's' : ''}`
                  : "undefined",
                accounts && accounts.length > 0 ? "success" : "error"
              )}
              {printProperty(
                "Address",
                ethersSigner ? ethersSigner.address : "No signer",
                ethersSigner ? "success" : "error"
              )}
              {printProperty("Contract", fheCounter.contractAddress, "success")}
              {printProperty("Status", fheCounter.isDeployed ? "Deployed" : "Not Deployed", fheCounter.isDeployed ? "success" : "error")}
            </div>
          </div>

          {/* Count Handle & Message */}
          <div className="info-card">
            <h2 className={titleClass}>Count Handle & Status</h2>
            
            {/* Count Handle Info */}
            {printProperty("Encrypted Counter", fheCounter.handle)}
            {printProperty("Current Value", fheCounter.isDecrypted ? fheCounter.clear : "Not decrypted")}
          </div>

          {/* Action Buttons - 2x3 Grid Layout */}
          <div className="button-grid-2x3">
            <button
              className={buttonClass}
              disabled={!fheCounter.canIncOrDec || fheCounter.isIncOrDec}
              onClick={() => fheCounter.incOrDec(+1)}
            >
              {fheCounter.canIncOrDec && !fheCounter.isIncOrDec
                ? "+1"
                : fheCounter.isIncOrDec
                  ? "Running..."
                  : "Cannot increment"}
            </button>
            <button
              className={buttonClass}
              disabled={!fheCounter.canIncOrDec || fheCounter.isIncOrDec}
              onClick={() => fheCounter.incOrDec(-1)}
            >
              {fheCounter.canIncOrDec && !fheCounter.isIncOrDec
                ? "-1"
                : fheCounter.isIncOrDec
                  ? "Running..."
                  : "Cannot decrement"}
            </button>
            <button
              className={buttonClass}
              disabled={!fheCounter.canDecrypt}
              onClick={fheCounter.decryptCountHandle}
            >
              {fheCounter.canDecrypt
                ? "Decrypt"
                : fheCounter.isDecrypted
                  ? `Decrypted: ${fheCounter.clear}`
                  : fheCounter.isDecrypting
                    ? "Decrypting..."
                    : "Nothing to decrypt"}
            </button>
            <button
              className={buttonClass}
              disabled={!fheCounter.canIncOrDec || fheCounter.isIncOrDec}
              onClick={() => fheCounter.incOrDec(+10)}
            >
              {fheCounter.canIncOrDec && !fheCounter.isIncOrDec
                ? "+10"
                : fheCounter.isIncOrDec
                  ? "Running..."
                  : "Cannot increment"}
            </button>
            <button
              className={buttonClass}
              disabled={!fheCounter.canIncOrDec || fheCounter.isIncOrDec}
              onClick={() => fheCounter.incOrDec(-10)}
            >
              {fheCounter.canIncOrDec && !fheCounter.isIncOrDec
                ? "-10"
                : fheCounter.isIncOrDec
                  ? "Running..."
                  : "Cannot decrement"}
            </button>
            <button
              className={buttonClass}
              disabled={!fheCounter.canGetCount}
              onClick={fheCounter.refreshCountHandle}
            >
              {fheCounter.canGetCount
                ? "Refresh"
                : "FHECounter is not available"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function printProperty(name: string, value: unknown, status?: "success" | "error") {
  let displayValue: string;

  if (typeof value === "boolean") {
    return printBooleanProperty(name, value);
  } else if (typeof value === "string" || typeof value === "number") {
    displayValue = String(value);
  } else if (typeof value === "bigint") {
    displayValue = String(value);
  } else if (value === null) {
    displayValue = "null";
  } else if (value === undefined) {
    displayValue = "undefined";
  } else if (value instanceof Error) {
    displayValue = value.message;
  } else {
    displayValue = JSON.stringify(value);
  }

  const valueClass = status ? `fhe-property-value ${status}` : "fhe-property-value";
  
  return (
    <p className="fhe-property-label">
      {name}:{" "}
      <span className={valueClass}>{displayValue}</span>
    </p>
  );
}

function getNetworkName(chainId: number | undefined): string {
  if (!chainId) return "Unknown";
  
  switch (chainId) {
    case 1: return "Ethereum Mainnet";
    case 11155111: return "Sepolia";
    case 137: return "Polygon";
    case 80001: return "Mumbai";
    case 31337: return "Hardhat";
    case 1337: return "Local";
    default: return `Chain ${chainId}`;
  }
}

function printBooleanProperty(name: string, value: boolean) {
  if (value) {
    return (
      <p className="fhe-property-label">
        {name}:{" "}
        <span className="fhe-property-true">true</span>
      </p>
    );
  }

  return (
    <p className="fhe-property-label">
      {name}:{" "}
      <span className="fhe-property-false">false</span>
    </p>
  );
}
