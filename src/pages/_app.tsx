import Layout from '@/components/sophon/layout/layout'
import Loading from '@/components/sophon/loading/loading'
import { Toaster } from '@/components/ui/toaster'
import '@/src/styles/globals.css'
import { userState } from '@/store/globalState'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Web3ReactProvider } from '@web3-react/core'
import { RecoilRoot, useRecoilState } from 'recoil'
import { ethers } from 'ethers'

export default function App({ Component, pageProps }: AppProps) {

  const ComponentWithUser = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();
    const [, setUser] = useRecoilState(userState);

    const accessibleRoutesWhenNotLoggedIn = ['/auth/login', '/auth/forgot', '/auth/register'];

    // useEffect(() => {
    //   const storedUserData = localStorage.getItem('user');
    //   if (storedUserData) {
    //     setUser(JSON.parse(storedUserData));
    //   } else if (!accessibleRoutesWhenNotLoggedIn.includes(router.pathname)) {
    //     router.push('/auth/login');
    //   }
    // }, [router, setUser]);

    if (accessibleRoutesWhenNotLoggedIn.includes(router.pathname)) {
      return <Component {...pageProps} />
    }

    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  };
  const getLibrary = (provider: any) => {
    const library = new ethers.providers.Web3Provider(provider)
    library.pollingInterval = 8000 // frequency provider is polling
    return library
}
  return (
    <RecoilRoot>
        <Web3ReactProvider getLibrary={getLibrary}>
        <ComponentWithUser Component={Component} {...pageProps} />
      </Web3ReactProvider>
      <Toaster />
      {/*  解开注释即可启用全局loading 会破坏用户的心流  */}
      {/* <Loading/> */}
    </RecoilRoot>
  )
}
