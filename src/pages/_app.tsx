import Layout from "@/components/sophon/layout/layout";
import Loading from "@/components/sophon/loading/loading";
import { Toaster } from "@/components/ui/toaster";
import "@/src/styles/globals.css";
import { userState } from "@/store/globalState";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Web3ReactProvider } from "@web3-react/core";
import { RecoilRoot, useRecoilState } from "recoil";
import { ethers } from "ethers";
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

    // useEffect(() => {
    //   const storedUserData = localStorage.getItem('user');
    //   if (storedUserData) {
    //     setUser(JSON.parse(storedUserData));
    //   } else if (!accessibleRoutesWhenNotLoggedIn.includes(router.pathname)) {
    //     router.push('/auth/login');
    //   }
    // }, [router, setUser]);

    if (accessibleRoutesWhenNotLoggedIn.includes(router.pathname)) {
      return <Component {...pageProps} />;
    }

    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  };
  const getLibrary = (provider: any) => {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = 8000; // frequency provider is polling
    return library;
  };

  const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [mainnet, polygon, optimism, arbitrum, base],
    ssr: true, // If your dApp uses server side rendering (SSR)
  });
  const queryClient = new QueryClient();

  return (
    <RecoilRoot>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
        <ComponentWithUser Component={Component} {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    
   
      <Toaster />
      {/*  解开注释即可启用全局loading 会破坏用户的心流  */}
      {/* <Loading/> */}
    </RecoilRoot>
  );
}
