import { createConfig, http, WagmiProvider } from "wagmi";
import { flowTestnet, flowMainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [flowTestnet, flowMainnet],
    transports: {
      [flowTestnet.id]: http(import.meta.env.VITE_RPC_TESTNET_URL),
      [flowMainnet.id]: http(import.meta.env.VITE_RPC_MAINNET_URL),
    },

    // Required API Keys
    walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_ID as string,

    // Required App Info
    appName: "EAS Flow Scanner",

    // Optional App Info
    appDescription: "EAS Flow Scanner",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  console.log(import.meta.env.WALLET_CONNECT_ID);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider debugMode>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
