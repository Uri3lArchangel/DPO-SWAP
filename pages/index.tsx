import Image from "next/image";
import { useRouter } from "next/router";
import React, {
  ChangeEvent,
  ChangeEventHandler,
  CSSProperties,
  useEffect,
  useState,
} from "react";
import Dropdown from "../src/components/Dropdown";
import { blur, unblur } from "../src/functions/backgrounBlur";
import { OPEN_CLOSE } from "../src/functions/selectToken";
import RootLayout from "../src/Layouts/RootLayout";
import {web3} from "../src/web3/metamaskConect";
import hm_l from "/styles/light/Home.module.css";
import axios, { AxiosError } from "axios";
import Typewriter from "../src/components/TypeWritter";
import CustomCOnnectButton from "../src/components/CustomCOnnectButton";
import { getAccount } from "@wagmi/core";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";


let hm = hm_l;


const addressParagraphStyle: CSSProperties = {
  position: "absolute",
  bottom: "0%",
  fontSize: "2rem",
  width: "100%",
  textAlign: "center",
  textOverflow: "ellipsis",
  overflow: "hidden",
  color: "white",
};


interface PROPS {
  apikey: string;
}

function Home({ apikey }: PROPS) {
  const router = useRouter();

  let fromToken: string = "";
  const [fromTokenState, setFromToken] = useState<string>("");
  let toToken: string = "";
  const [toTokenState, setToToken] = useState("");
  const [value, setValue] = useState<string>();
  const [valueExchanged, setValueExchanged] = useState<string>("");
  const [valueExchangedDecimals, setValueEXchangedDecimals] = useState(1e18);
  const [to, setTo] = useState("");
  const [txData, setTxData] = useState("");
  const [fromBalance, setFromBalance] = useState<string>();
  const [opened, setStateOpened] = useState<boolean>(false);
  const [openedWalletWindw, setStateOpenedWalletWindow] =
    useState<boolean>(false);
  const {address,isConnected} = useAccount()
  const [selectedButton, setButton] = useState<HTMLElement>();
  const [selectedTokenName, setSelectedTokenName] = useState("");
  let tokenName: string = "";
  const [id, setId] = useState("");

  const txObject={
    from:address,
    to:to,
    value:String(value),
    data:String(txData),
  }

  const confirmSwap=async()=>{
    try{
      if(web3){
    const sendTx = await web3.eth.sendTransaction(txObject)
    console.log(sendTx)
      }
      else{
        return
      }
  }catch(err:any){
    alert(err.message)
  }
  }

  function open_close(e: React.MouseEvent<HTMLElement>) {
    if (!opened) {
      setButton(e.currentTarget);
      setId(e.currentTarget.id);
      blur();
    } else {
      unblur();
      if (id == "from") {
        switch (tokenName) {
          case "Ethereum":
            fromToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
            break;
          case "DPO":
            fromToken = "0x73ea12A934a9A08614D165DB30F87BdfD1A2Cb92";
            break;
          default:
            fromToken = "";
            break;
        }
        setFromToken(fromToken);
      } else if (id == "to") {
        switch (tokenName) {
          case "Ethereum":
            toToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
            break;
          case "DPO":
            toToken = "0x73ea12A934a9A08614D165DB30F87BdfD1A2Cb92";
            break;
          default:
            toToken = "";
            break;
        }
        setToToken(toToken);
      }
    }

    setStateOpened(OPEN_CLOSE());
  }

  function selectTokenItem(e: React.MouseEvent<HTMLElement>) {
    let id = e.currentTarget.id;
    let element = document.querySelector(`#${id} p`) as HTMLParagraphElement;
    tokenName = element.innerHTML;
    setSelectedTokenName(tokenName);
    if (tokenName != "" && selectedButton != undefined) {
      selectedButton.innerHTML = tokenName;
    }
    unblur();
    open_close(e);
  }


  async function changeValue(e: ChangeEvent<HTMLInputElement>) {
    let value = parseFloat(e.currentTarget.value);
    setValue(`${value * 1e18}`);
    setValueExchanged("");
    console.log(value);
  }
  async function getInchSwap() {
    try {
      if (fromTokenState != "" && toTokenState != "") {
        console.log(fromTokenState);
        console.log(toTokenState);

        if (!address || address === '0x ') {
          console.log(address)
          alert("Please connect your wallet");
          return;
        }
        const tx =
          await axios.get(`https://api.1inch.io/v5.0/42161/swap?fromTokenAddress=${fromTokenState}&toTokenAddress=${toTokenState}&amount=${value}&fromAddress=${address}&slippage=1
    `);
        setTo(tx.data.tx.to);
        setTxData(tx.data.tx.data);
        setValueEXchangedDecimals(Number(`1E${tx.data.toToken.decimals}`));
        setValueExchanged(tx.data.toTokenAmount);
        console.log(tx.data);
      } else {
        setValueExchanged("select a token to convert from and to convert to");
      }
    } catch (err: any) {
      if (err.response.data.description == "Internal Server Error") {
        setValueExchanged(" ");
      } else {
        setValueExchanged(err.response.data.description);
        console.log(valueExchanged);
      }
    }
  }



  useEffect(() => {
getAccount()
  }, [address]);

  return (
    <RootLayout>
      <div
        id="main"
        className={hm.main}
        onClick={(e) => {
          if (opened) {
            open_close(e);
          }
          
        }}
      >
        <div className={hm.swapContainer}>
          <Typewriter text="DPO SWAP" />
          <div>
            <input
              type="text"
              className={hm.input}
              placeholder="Enter Amount"
              onChange={changeValue}
              onKeyUp={getInchSwap}
              maxLength={6}
            />
            {false ? <button>Max</button> : <></>}{" "}
            <button id="from" onClick={open_close}>
              ChooseToken
            </button>
          </div>
          <div>
            <input
              type="text"
              className={hm.input}
              value={
                !valueExchanged
                  ? ""
                  : (
                      parseFloat(valueExchanged) / valueExchangedDecimals
                    ).toFixed(4) == "NaN"
                  ? valueExchanged
                  : (
                      parseFloat(valueExchanged) / valueExchangedDecimals
                    ).toFixed(4)
              }
              readOnly
            />
            {false ? <button>Max</button> : <></>}
            <button id="to" onClick={open_close}>
              ChooseToken
            </button>
          </div>
        <CustomCOnnectButton confirmSwap={confirmSwap} valueExchanged={valueExchanged} valueExchangedDecimals={valueExchangedDecimals} />
        
        </div>
        <p style={addressParagraphStyle}>{address}</p>
      </div>

      {opened ? (
        <Dropdown select={selectTokenItem} close={open_close} hm={hm} />
      ) : (
        <></>
      )}
     
    </RootLayout>
  );
}

export default Home;

export async function getServerSideProps() {
  
  const apikey = process.env.APIKEY;
  return {
    props: { apikey },
  };
}
