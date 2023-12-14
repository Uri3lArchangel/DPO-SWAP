'use client'
import { PayPalScriptProvider, ReactPayPalScriptOptions } from '@paypal/react-paypal-js'
import React from 'react'

function PaypalCustomProvider({children,clientID,currency}:{children:React.ReactNode;clientID:string;currency:string}) {
  return (
   <PayPalScriptProvider options={{clientId:clientID,currency:currency}}>
    {children}
   </PayPalScriptProvider>
  )
}

export default PaypalCustomProvider