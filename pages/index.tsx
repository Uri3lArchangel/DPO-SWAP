import Image from "next/image";
import { useRouter } from "next/router";
import React, { CSSProperties, useEffect, useState } from "react";
import Dropdown from "../src/components/Dropdown";
import WalletConnect from "../src/components/WalletConnect";
import { blur, unblur } from "../src/functions/backgrounBlur";
import { OPEN_CLOSE } from "../src/functions/selectToken";
import RootLayout from "../src/Layouts/RootLayout";
import { errorObjectTemplate, metamaskConnect } from "../src/web3/metamaskConect";
import { fetchBalances } from "../src/web3/swapFunction";
import hm_l from "/styles/light/Home.module.css";


let hm = hm_l;

declare global {
  interface Window {
    ethereum?: any;
  }
}


const addressParagraphStyle: CSSProperties = {
  position: "absolute",
  bottom: "0%",
  fontSize: "3rem",
  width: "100%",
  textAlign: "center",
};
interface PROPS{
  apikey:string
}

function Home({apikey}:PROPS) {
  const [fromToken,setFromToken] = useState("")
  const[toToken,setToToken] =useState("")
  const [opened, setStateOpened] = useState<boolean>();
  const [openedWalletWindw, setStateOpenedWalletWindow] =useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [selectedButton, setButton] = useState<HTMLElement>();
  let tokenName: string = "";
  const router = useRouter()

  function open_close(e: React.MouseEvent<HTMLElement>) {
    setButton(e.currentTarget);
    if (!opened) {
      blur();
    } else {
      unblur();
    }
    setStateOpened(OPEN_CLOSE());
  }

  function selectTokenItem(e: React.MouseEvent<HTMLLIElement>) {
    let id = e.currentTarget.id;
    let element = document.querySelector(`#${id} p`) as HTMLParagraphElement;
    tokenName = element.innerHTML;
    console.log(selectedButton);
    if (tokenName != "" && selectedButton != undefined) {
      selectedButton.innerHTML = tokenName;
    }
    unblur();
    setStateOpened(OPEN_CLOSE());
  }
  function walletWindow() {
    setStateOpened(false);
    setStateOpenedWalletWindow(OPEN_CLOSE());
    if (!openedWalletWindw) {
      blur();
    } else {
      unblur();
    }
  }

  async function walletConnect(){
    window.localStorage.clear()
    setAddress(await metamaskConnect())
  window.localStorage.setItem('session',"true")
  }

useEffect(()=>{
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', (accounts:string[]) => {
      if (accounts.length === 0) {
        window.localStorage.clear()
        router.reload()
      }
    });
    window.ethereum.on('chainChanged',()=>{
      router.reload()
    }),[address]
  }
  

  async function init(){
   await walletConnect()
   console.log(await fetchBalances(address,apikey))
   
  }

  if(window.localStorage.getItem('session') == "true" ){
    init()
    
    
  }
  


},[address])


  return (
    <RootLayout>
      <div
        id="main"
        className={hm.main}
        onClick={(e) => {
          if (opened) {
            open_close(e);
          }
          if (openedWalletWindw) {
            walletWindow();
          }
        }}
      >
        <div className={hm.swapContainer}>
          <h1>DPO SWAP</h1>
          <hr />
          <div>
            <input
              type="text"
              className={hm.input}
              placeholder="Enter Amount"
            />
            {false ? <button>Max</button> : <></>}{" "}
            <button onClick={open_close}>ChooseToken</button>
          </div>
          <div>
            <input
              type="text"
              className={hm.input}
              placeholder="Enter Amount"
            />
            {false ? <button>Max</button> : <></>}
            <button onClick={open_close}>ChooseToken</button>
          </div>
          {address != '' ? ( errorObjectTemplate.errorID == 0?
            <button>Swap</button>:<button>{errorObjectTemplate.reason}</button>
          ) : (
            <button onClick={walletWindow}>Connect Wallet</button>
          )}
        </div>
        <p style={addressParagraphStyle}>{address}</p>
      </div>

      {opened ? (
        <Dropdown select={selectTokenItem} close={open_close} hm={hm} />
      ) : (
        <></>
      )}
      {openedWalletWindw ? (
        <WalletConnect connect={walletConnect} window={walletWindow} mode={hm} />
      ) : (
        <></>
      )}
    </RootLayout>
  );
}

export default Home;

export async function getServerSideProps() {
const apikey = process.env.APIKEY
return{
  props:{apikey}
}
}