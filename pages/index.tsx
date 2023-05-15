import Image from "next/image";
import { useRouter } from "next/router";
import { HiChevronDown } from "react-icons/hi2";
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
import { web3 } from "../src/web3/metamaskConect";
import hm_l from "/styles/light/Home.module.css";
import axios, { AxiosError } from "axios";
import Typewriter from "../src/components/TypeWritter";
import CustomCOnnectButton from "../src/components/CustomCOnnectButton";
import { getAccount } from "@wagmi/core";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import { tokensData } from "../src/core/tokenData";

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
  const { address, isConnected } = useAccount();
  const [selectedButton, setButton] = useState<HTMLElement>();
  const [selectedTokenName, setSelectedTokenName] = useState("");
  let tokenName: string = "";
  const [id, setId] = useState("");
const [fromTokenImage,setFromTokenImage] = useState("https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png")
  const txObject = {
    from: address,
    to: to,
    value: String(value),
    data: String(txData),
  };

  const confirmSwap = async () => {
    try {
      if (web3) {
        const sendTx = await web3.eth.sendTransaction(txObject);
        console.log(sendTx);
      } else {
        return;
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  function open_close(e: React.MouseEvent<HTMLElement>) {
    if (!opened) {
      setButton(e.currentTarget);
      setId(e.currentTarget.id);
      blur();
    } else {
      unblur();
      if (tokenName) {
        if (id == "from") {
          fromToken = tokensData[tokenName].address;
          setFromToken(fromToken);
          setFromTokenImage(tokensData[tokenName].logo)

        } else if (id == "to") {
          toToken = tokensData[tokenName].address;
          setToToken(toToken);
        }
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
      document.querySelector(`#${selectedButton.id} p`)!.innerHTML = tokensData[tokenName].symbol;
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

        if (!address || address === "0x ") {
          console.log(address);
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
    getAccount();
  }, [address,fromTokenImage]); 

  return (
    <RootLayout>
      <article
        id="main"
        className={hm.main}
        onClick={(e) => {
          if (opened) {
            open_close(e);
          }
        }}
      >
        <div className={hm.Container}>
          <Typewriter text="DPO SWAP" />
          <section className={hm.swapContainer}>
            <section className={hm.fromSwapContainer}>
              <div>
                <button
                  id="from"
                  className={hm.SwapButton}
                  onClick={open_close} 
                >
                  <Image  
                    src={fromTokenImage}
                    width="240"
                    decoding="sync"
                    height="240"
                    alt="logo"
                  />
                  <p className="mx-2 text-2xl">ETH</p>
                  <HiChevronDown className="mx-1" size={15} />
                </button>

                <div className="">
                  <p className="text-right text-lg text-gray-500 md:text-2xl">
                    Balance: 100
                  </p>
                  <div className="flex justify-between ">
                    <button className="bg-gray-200 px-4 py-2 rounded-full text-xl mr-1 md:text-2xl md:px-8 md:py-3 ">
                      Max
                    </button>
                    <select className="bg-gray-200 px-2 py-1 cursor-pointer outline-none rounded-full text-xl ml-1 md:text-2xl md:px-8 md:py-3">
                      <option value="1">Slippage: 1%</option>
                      <option  value="5">Slippage: 5%</option>
                      <option  value="7">Slippage: 7%</option>
                    </select>
                  </div>
                </div>
              </div>
              <label htmlFor="input1"></label>
              <div className="flex justify-between items-center">
              <input
                id="input1"
                type="text"
                className={hm.input}
                placeholder="Enter Amount"
                onChange={changeValue}
                onKeyUp={getInchSwap}
                maxLength={6}
              />
              <span className="text-gray-600 text-xl">$100</span>
              </div>
            </section>

            <section className={hm.toSwapContainer}>
              <button
                id="to"
                onClick={open_close}
                className={hm.SwapButton}
              >
                <Image
                  src={
                    "https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                  }
                  width="240"
                  height="240"
                  alt="logo"
                />
                <p className="mx-2 text-2xl">USDT</p>
                <HiChevronDown className="mx-1" size={15} />
              </button>
              <label htmlFor="input2Disabled"></label>
              <div className="flex justify-between items-center">
                <input
                  id="input2Disabled"
                  type="text"
                  placeholder="Amount to Receive"
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
                <span className="text-gray-600 text-xl">$100</span>
              </div>
            </section>
            <div className={"my-3 "+hm.connectButtonContainer}>
            <CustomCOnnectButton
            confirmSwap={confirmSwap}
            valueExchanged={valueExchanged}
            valueExchangedDecimals={valueExchangedDecimals}
          />
          </div>
          </section>
        
        </div>
       
      </article>

      {opened ? (
        <Dropdown select={selectTokenItem} close={open_close} hm={hm} />
      ) : (
        <></>
      )}
    </RootLayout>
  );
}

export default Home;
interface ServerObj {
  req: NextApiRequest;
  res: NextApiResponse;
}

export async function getServerSideProps({ req, res }: ServerObj) {
  if (req.url == "https://swap.directprivatepffers/assets/*") {
    res.redirect("https://swap.directprivateoffers.com/404");
  }
  const apikey = process.env.APIKEY;
  return {
    props: { apikey },
  };
}
