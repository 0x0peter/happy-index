import Layout from "@/components/sophon/layout/layout";
// import Loading from "@/components/sophon/loading/loading";
import { Toaster } from "@/components/ui/toaster";
import "@/src/styles/globals.css";
import { userState } from "@/store/globalState";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { RecoilRoot, useRecoilState } from "recoil";
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

export default function App({ Component, pageProps }: AppProps) {
  const ComponentWithUser = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();
    const [, setUser] = useRecoilState(userState);

    const accessibleRoutesWhenNotLoggedIn = [
      "/auth/login",
      "/auth/forgot",
      "/auth/register",
    ];


    if (accessibleRoutesWhenNotLoggedIn.includes(router.pathname)) {
      return <Component {...pageProps} />;
    }

    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  };

  const config = getDefaultConfig({
    appName: 'HappyIndex',
    projectId:'a46f7878ece2f9eaec319f8f850320ff',
    chains: [mainnet, polygon, optimism, arbitrum, base],
    ssr: true, // If your dApp uses server side rendering (SSR)
  });
  const queryClient = new QueryClient();

  return (
    
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
        <RecoilRoot>
        <ComponentWithUser Component={Component} {...pageProps} />
        <Toaster />
        </RecoilRoot>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    
   

   
  );
}
