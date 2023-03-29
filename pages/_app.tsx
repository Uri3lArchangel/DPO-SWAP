import "../styles/globals.css";
import type { AppProps } from "next/app";

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { useEffect } from "react";


const { chains, provider } = configureChains(
  [arbitrum],
  [
    infuraProvider({ apiKey: process.env.INFURARPC!}),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})


export default function App({ Component, pageProps }: AppProps) {
 
  
  return (
    <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains} modalSize='wide'>
        <Component {...pageProps} />
        </RainbowKitProvider>
    </WagmiConfig>

  );
   
}
