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
  metamaskConnect,
} from "../src/web3/metamaskConect";
import { fetchBalances } from "../src/web3/swapFunction";
import hm_l from "/styles/light/Home.module.css";
import axios, { AxiosError } from "axios";

let hm = hm_l;

declare global {
  interface Window {
    ethereum?: any;
  }
}

const addressParagraphStyle: CSSProperties = {
  position: "absolute",
  bottom: "0%",
  fontSize: "2rem",
  width: "100%",
  textAlign: "center",
  textOverflow:'ellipsis',
  overflow:'hidden'
};
const balanceStypeProp: CSSProperties = {
  fontSize: "1.6rem",
  margin: "0.3em",
  width: "fit-content",
};

interface PROPS {
  apikey: string;
}

function Home({ apikey }: PROPS) {
  let fromToken: string = "";
  const [fromTokenState, setFromToken] = useState<string>();
  let toToken: string = "";
  const [toTokenState, setToToken] = useState("");
  const [value, setValue] = useState<string>();
  const [valueExchanged, setValueExchanged] = useState("");
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
  const router = useRouter();

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
    setStateOpened(false);
    setStateOpenedWalletWindow(OPEN_CLOSE());
    if (!openedWalletWindw) {
      blur();
    } else {
      unblur();
    }
  }

  function changeValue(e: ChangeEvent<HTMLInputElement>) {
    let value = parseFloat(e.currentTarget.value);
    setValue(`${value * 1e18}`);
    setValueExchanged("");
  }
  async function getInchSwap() {
   try{
    if(address != '' && fromTokenState != '' && toTokenState != '' ){
    const tx =await axios.get(`https://api.1inch.io/v5.0/42161/swap?fromTokenAddress=${fromTokenState}&toTokenAddress=${toTokenState}&amount=${value}&fromAddress=${address}&slippage=1
    `)
    setTo(tx.data.tx.to)
    setTxData(tx.data.tx.data)
    setValueEXchangedDecimals(Number(`1E${tx.data.toToken.decimals}`))
    setValueExchanged(tx.data.toTokenAmount)
    }else{
      alert('select a token to convert from and to convert to')
    }
   }catch(err:any){
    alert(err.response.data.description)

   }
  }

  async function walletConnect() {
    window.localStorage.clear();
    setAddress(await metamaskConnect());
    window.localStorage.setItem("session", "true");
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          window.localStorage.clear();
          router.reload();
        }
        router.reload();
      });
      window.ethereum.on("chainChanged", () => {
        router.reload();
      }),
        [];
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
          <h1>DPO SWAP</h1>
          <hr />
          <div>
            <input
              type="text"
              className={hm.input}
              placeholder="Enter Amount"
              onChange={changeValue}
              maxLength={5}
            />
            {false ? <button>Max</button> : <></>}{" "}
            <button id="from" onClick={open_close}>
              ChooseToken
            </button>
          </div>
          <p style={balanceStypeProp}>balance: {fromTokenState == '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'? fromBalance:''}</p>
          <div>
            <input type="text" className={hm.input} value={
              !valueExchanged?"":
              (parseFloat(valueExchanged)/valueExchangedDecimals).toFixed(4)
            } readOnly />
            {false ? <button>Max</button> : <></>}
            <button id="to" onClick={open_close}>
              ChooseToken
            </button>
          </div>
          {address != "" ? (
            errorObjectTemplate.errorID == 0 ? (
              <button onClick={getInchSwap}>Swap</button>
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
