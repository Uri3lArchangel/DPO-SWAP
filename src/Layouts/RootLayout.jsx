import React from 'react'
import Head from 'next/head'
import Footer from '../components/Footer'
import hm_l from "/styles/light/Home.module.css";
import TopBar from '../components/TopBar';

let hm = hm_l

function RootLayout({children}) {
  return (
    <>
     <Head>
        <title>Direct Private Offers | Decentralized Swap Exchange</title>
        <meta name="description" content="A Decentralized Swap Exchange of the DPO (Direct Private Offers) Security token, the main domain is at https://directprivateoffers.com, with a list of transaction receipts off the blockchain at https://receipts.directprivateoffers.com" />
        <meta name="description" content="DEX SWAP EXCHANGE WEB3 BLOCKCHAIN DPO ARBITRIUM SECURITY TOKEN " />
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/handshake.png" />
        <link rel="canonical" href="https://swap.directprivateoffers.com" />
    </Head>
    <TopBar mode={hm} />
    <main>{children}</main>
    <Footer mode={hm} />
    </>
  )
}

export default RootLayout