import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Image from "next/image";
import { ConnectWalletProvider } from "./components/ConnectWalletProvider";

export const metadata: Metadata = {
  title: "Zama FHEVM SDK Quickstart",
  description: "Zama FHEVM SDK Quickstart app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="zama-bg">
        <main className="app-container">
          <header className="header">
            <div className="logo-wrap">
              <Image
                src="/zama-logo.svg"
                alt="Zama Logo"
                width={120}
                height={120}
              />
              <h1>Zama FHEVM Counter</h1>
            </div>
            <ConnectWalletProvider />
          </header>

          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
