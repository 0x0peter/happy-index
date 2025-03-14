import Layout from "@/components/sophon/layout/layout";
// import Loading from "@/components/sophon/loading/loading";
import { Toaster } from "@/components/ui/toaster";
import "@/src/styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import "@rainbow-me/rainbowkit/styles.css";
import { okxWallet } from "@rainbow-me/rainbowkit/wallets";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export default function App({ Component, pageProps }: AppProps) {
  const config = getDefaultConfig({
    appName: "HappyIndex",
    projectId: "a46f7878ece2f9eaec319f8f850320ff",
    chains: [mainnet, polygon, optimism, arbitrum, base, {
      id: 177,
      name: 'Hashkey Chain',
      nativeCurrency: { name: 'HSK', symbol: 'HSK', decimals: 18 },
      rpcUrls: {
        default: {
          http: ['https://rpc.hsk.xyz'],
        },
      },
      
    }],
    ssr: true, // If your dApp uses server side rendering (SSR)
  });
  const queryClient = new QueryClient();

  return (
    <RecoilRoot>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <Toaster />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </RecoilRoot>
  );
}
