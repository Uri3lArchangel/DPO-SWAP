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
        <title>Busd to Busd2</title>
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <main>{children}</main>
    </>
  )
}

export default RootLayout