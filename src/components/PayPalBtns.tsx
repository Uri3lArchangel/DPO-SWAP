'use client'
import { PayPalButtons } from '@paypal/react-paypal-js'
import React from 'react'
import { CreateOrderRequestBody,CreateOrderActions,CreateOrderData } from "@paypal/paypal-js";
import { OnClickActions,OnApproveData,OnApproveActions } from '@paypal/paypal-js/types/components/buttons'


type ButtonFunctions={
  createOrder?: ((data: CreateOrderData, actions: CreateOrderActions) => Promise<string>),
  onClick?:((data: Record<string, unknown>, actions: OnClickActions) => void | Promise<void>),
  onApprove?:((data: OnApproveData, actions: OnApproveActions) => Promise<void>) 
}


function PayPalBtns({createOrder,onClick,onApprove}:ButtonFunctions) {



  return (
    <PayPalButtons createOrder={createOrder} onClick={onClick} onApprove={onApprove}  />
  )
}

export default PayPalBtns