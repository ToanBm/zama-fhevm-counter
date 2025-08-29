export function errorNotDeployed(chainId: number | undefined) {
  return (
    <div className="grid w-full gap-4 mx-auto font-semibold bg-none">
      <div className="col-span-full mx-20">
        <p className="text-4xl leading-relaxed">
          {" "}
          <span className="font-mono bg-red-500">Error</span>:{" "}
          <span className="font-mono bg-white">FHECounter.sol</span> Contract
          Not Deployed on{" "}
          <span className="font-mono bg-white">chainId={chainId}</span>{" "}
          {chainId === 11155111 ? "(Sepolia)" : ""} or Deployment Address
          Missing.
        </p>
        <p className="text-2xl leading-relaxed mt-8 text-center">
          You haven&apos;t deployed the contract on the current network. Please deploy or connect and switch to Sepolia network.
        </p>
      </div>
    </div>
  );
}
