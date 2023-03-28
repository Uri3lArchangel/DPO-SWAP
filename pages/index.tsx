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
import WalletConnect from "../src/components/WalletConnect";
import { blur, unblur } from "../src/functions/backgrounBlur";
import { OPEN_CLOSE } from "../src/functions/selectToken";
import RootLayout from "../src/Layouts/RootLayout";
import {
  errorObjectTemplate,
  metamaskConnect, web3
} from "../src/web3/metamaskConect";
import { fetchBalances } from "../src/web3/swapFunction";
import hm_l from "/styles/light/Home.module.css";
import axios, { AxiosError } from "axios";
import Typewriter from "../src/components/TypeWritter";

declare global{
  interface Window{
    ethereum?:any
  }
}

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
const balanceStypeProp: CSSProperties = {
  fontSize: "2rem",
  margin: "0.3em",
  width: "fit-content",
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
  const [address, setAddress] = useState<string>("");
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
        // console.log(await web3.eth.getAccounts())
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
  function walletWindow() {
    setStateOpenedWalletWindow(OPEN_CLOSE());
    if (!openedWalletWindw) {
      blur();
    } else {
      unblur();
    }
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

        if (address == "") {
          walletConnect();
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

  async function walletConnect() {
    window.localStorage.clear();
    setAddress(await metamaskConnect());
    window.localStorage.setItem("session", "true");
  }


  useEffect(() => {
  
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on!("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          window.localStorage.clear();
          router.reload();
        }
        router.reload();
      });
      window.ethereum.on("chainChanged", () => {
        router.reload();
      });
     
      

    }else{
      return
    }

    async function init() {
      await walletConnect();
      setFromBalance(await fetchBalances(address, apikey));
    }

    if (window.localStorage.getItem("session") == "true") {
      init();
    }
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
          if (openedWalletWindw) {
            walletWindow();
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
          {/* <p style={balanceStypeProp}>
            balance:{" "}
            {fromTokenState == "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
              ? fromBalance
              : ""}
          </p> */}
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
          {address != "" ? (
            errorObjectTemplate.errorID == 0 ? (parseFloat(valueExchanged) / valueExchangedDecimals).toFixed(4) == "NaN"?
            (
              <button disabled>Swap</button>
            ):(
              <button onClick={confirmSwap}>Swap</button>
            ) : (
              <button>{errorObjectTemplate.reason}</button>
            )
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
        <WalletConnect
          connect={walletConnect}
          window={walletWindow}
          mode={hm}
        />
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
