"use client";
import React, { useContext, useRef, useState } from "react";
import { CreateOrderActions, CreateOrderData } from "@paypal/paypal-js";
import {
  OnClickActions,
  OnApproveData,
  OnApproveActions,
} from "@paypal/paypal-js/types/components/buttons";
import { NotificationContext, NotificationDataObject } from "./Note";
import { isAddress } from "web3-validator";
import PayPalBtns from "./PayPalBtns";
import PaypalCustomProvider from "./PaypalCustomProvider";

function HomeFiat({ clientID }: { clientID: string }) {
  const noteContext = useContext(NotificationContext)!;
  const [total,setTotal]=useState(0)
  const amountRef = useRef<HTMLInputElement>(null);
  const walletRef = useRef<HTMLInputElement>(null);
  let order = {
    purchase_units: [
      {
        description: "DPOI PURCHASE",
        amount: {
          value: "0" as string,
        },
      },
    ],
  };
  const change=()=>{
    setTotal(parseInt(amountRef.current!.value) * 870.00)
  }

  const setupCreateOrder = (
    data: CreateOrderData,
    action: CreateOrderActions
  ) => {
    order.purchase_units[0].amount.value = String(parseInt(amountRef.current!.value)* 870.00) ;
    return action.order.create(order);
  };
  const setupBeforeOrder = (
    _: Record<string, unknown>,
    action: OnClickActions
  ) => {
    
    if (!amountRef.current) {
      const notification: NotificationDataObject = {
        message: "Invalid DPOI amount",
        description:
          "You have entered an invalid amount of DPOI tokens to buy, ensure you only input numbers",
        type: "error",
      };
      noteContext(notification);

      return action.reject();
    }
    const inputAmountValue = amountRef.current.value;
    if((inputAmountValue) =='' ){
      const notification: NotificationDataObject = {
        message: "Invalid DPOI amount",
        description:
          "You have entered an invalid investment amount, ensure you only input numbers",
        type: "error",
      };
      noteContext(notification);
      return action.reject();

    }
    if (isNaN(parseFloat(inputAmountValue))) {
      const notification: NotificationDataObject = {
        message: "Invalid DPOI amount",
        description:
          "You have entered an invalid investment amount, ensure you only input numbers",
        type: "error",
      };
      noteContext(notification);
      return action.reject();
    }
    if (!walletRef.current) {
      const notification: NotificationDataObject = {
        message: "Enter a wallet address",
        description:
          "please specify the wallet address to receive your tokens in",
        type: "error",
      };
      noteContext!(notification);

      return action.reject();
    }
    if (walletRef.current!.value == "") {
      const notification: NotificationDataObject = {
        message: "Enter a wallet address",
        description:
          "please specify the wallet address to receive your tokens in",
        type: "error",
      };
      noteContext(notification);

      return action.reject();
    }

    if (!isAddress(walletRef.current.value)) {
      const notification: NotificationDataObject = {
        message: "Enter a valid address",
        description:
          "the address provided is not a valid address please check it and ensure there is no error",
        type: "error",
      };
      noteContext(notification);

      return action.reject();
    }
  };
  const Approve = async () => {
    const notification: NotificationDataObject = {
      message: "Purchse Successful",
      description: "",
      type: "success",
    };
    noteContext(notification);
  };

  return (
    <section className="bg-white min-h-[100vh] pt-20">
      <header className="text-center text-black py-2">
        <h1 className="text-4xl font-bold">
          Buy <span className="text-green-400">DPO</span> Tokens via Fiat
          Portal
        </h1>
        <h2 className="text-md my-4 text-2xl">DPO Global LLC: Tokens Available Here</h2>
        <p>Price: $40 USD per Token, less 13% discount to market = $34.82 USD</p>
      </header>
      <main>
        <form className="w-[90%] mx-auto  sm:w-[60%] lg:w-[40%]">
          <input
            type="text"
            ref={amountRef}
            className="w-[90%] text-xl text-black placeholder:text-black/90 mx-auto block bg-transparent border border-green-300 rounded-md px-4 h-16 outline-none my-4"
            placeholder="Amount?"
            onChange={change}
          />
          <input
            type="text"
            name=""
            ref={walletRef}
            className="w-[90%] text-xl text-black placeholder:text-black/90 mx-auto block bg-transparent border border-green-300 rounded-md px-4 h-16 outline-none my-4"
            id=""
            placeholder="Address?"
          />
          <input
            type="text"
            value={total+ ' CAD'}
            className="w-[90%] text-xl text-black placeholder:text-black/90 mx-auto block bg-white/40 border cursor-not-allowed border-green-300 rounded-md px-4 h-16 outline-none my-4 "
            placeholder="Total"
            disabled
          />
          <PaypalCustomProvider clientID={clientID} currency={"CAD"}>
            <PayPalBtns
              createOrder={setupCreateOrder}
              onClick={setupBeforeOrder}
              onApprove={Approve}
            />
          </PaypalCustomProvider>
        </form>
      </main>
    </section>
  );
}

export default HomeFiat;
