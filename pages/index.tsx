import Image from "next/image";
import { useRouter } from "next/router";
import { HiChevronDown } from "react-icons/hi2";
import React, {
  ChangeEvent,
  ChangeEventHandler,
  CSSProperties,
  useEffect,
  useRef,
  useState,
} from "react";
import { message } from "antd";
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
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import { tokensData } from "../src/core/tokenData";
import { RTB } from "../src/web3/returnTokenBalance";
import { priceFetch } from "../src/web3/getPrice";
import Note from "../src/components/Note";
import HomeFiat from "../src/components/HomeFiat";

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
  clientID:string
}

function Home({ apikey,clientID }: PROPS) {
  const router = useRouter();

  // variables and states that hold the token addresses of selected tokens
  let fromToken: string = "";
  const [fromTokenState, setFromToken] = useState<string>(
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
  );
  let toToken: string = "";
  const [toTokenState, setToToken] = useState(
    "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9"
  );

  // value passed into from token input field
  const [value, setValue] = useState<string>();

  // value converted
  const [valueExchanged, setValueExchanged] = useState<string>("");

  // token decimals, hardcoded now
  const [valueExchangedDecimals, setValueEXchangedDecimals] = useState(1e18);

  // 1inch aggregator address
  const [to, setTo] = useState("");

  // transaction data to be sent to the blockchain
  const [txData, setTxData] = useState("");

  // balance of from token
  const [fromBalance, setFromBalance] = useState<number>(0);

  // state check to see if token select window is opened or not
  const [opened, setStateOpened] = useState<boolean>(false);

  // address of current user connected
  const { address, isConnected } = useAccount();

  // the from or to button clicked on
  const [selectedButton, setButton] = useState<HTMLElement>();

  // the name of the token selected
  let tokenName: string = "";

  // id of from or to button selected
  const [id, setId] = useState("");

  // image of currently selected token
  const [fromTokenImage, setFromTokenImage] = useState(
    "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png"
  );
  const [toTokenImage, setToTokenImage] = useState(
    "https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
  );

  // amount of slippage
  const [slippageValue, setSlippageValue] = useState<number>(1);

  const [fromPrice, setFromPrice] = useState("");

  const [toPrice, setToPrice] = useState("");

  const slippageRef = useRef<HTMLSelectElement>(null);

  const [messageApi, contextHolder] = message.useMessage();

  //transaction message for swap
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
          setFromTokenImage(tokensData[tokenName].logo);
        } else if (id == "to") {
          toToken = tokensData[tokenName].address;
          setToTokenImage(tokensData[tokenName].logo);
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
    // setSelectedTokenName(tokenName);
    if (tokenName != "" && selectedButton != undefined) {
      document.querySelector(`#${selectedButton.id} p`)!.innerHTML =
        tokensData[tokenName].symbol;
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
  const max = async () => {
    (document.getElementById("input1") as HTMLInputElement).value =
      String(fromBalance);
    await getInchSwap();
  };
  async function getInchSwap() {
    try {
      setSlippage();
      if (fromTokenState != "" && toTokenState != "") {
        if (!address || address === "0x ") {
          console.log(address);
          alert("Please connect your wallet");
          return;
        } else if (!slippageValue || slippageValue < 1 || slippageValue > 50) {
          messageApi.error("Slippage error", 5);
          setTimeout(() => {
            messageApi.destroy();
          });
        }
        console.log("slippageValue", slippageValue);
        const tx = await axios.get(
          `https://api.1inch.io/v5.0/42161/swap?fromTokenAddress=${fromTokenState}&toTokenAddress=${toTokenState}&amount=${value}&fromAddress=${address}&slippage=${slippageValue}`
        );
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
  const setSlippage = () => {
    if (slippageRef.current) {
      setSlippageValue(parseInt(slippageRef.current?.value));
    }

  };
  useEffect(() => {
    const init = async () => {
      RTB(apikey, address!);
      if (fromTokenState) {
        setFromPrice(
          String(
            (await priceFetch(apikey, fromTokenState))?.usdPrice?.toFixed(2)
          )
        );
      }
      if (toTokenState) {
        setToPrice(
          String((await priceFetch(apikey, toTokenState))?.usdPrice?.toFixed(2))
        );
      }
      getAccount();
    };
    init();
  }, [address, fromTokenImage, fromTokenState, toTokenState]);

  return (
    <>
    <RootLayout>
      {contextHolder}
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
          <Typewriter text="LAYER II Decentralized Blockchain Ecosystem for Issuance of Digital Asset Securities" />
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
                    Balance: 0
                  </p>
                  <div className="flex justify-between ">
                    <button
                      onClick={max}
                      className="bg-gray-200 px-4 py-2 rounded-full text-xl mr-1 md:text-2xl md:px-8 md:py-3 "
                    >
                      Max
                    </button>
                    <select
                      id="slippage"
                      ref={slippageRef}
                      className="bg-gray-200 px-2 py-1 cursor-pointer outline-none rounded-full text-xl ml-1 md:text-2xl md:px-8 md:py-3"
                    >
                      <option value="1">Slippage: 2%</option>
                      <option value="5">Slippage: 10%</option>
                      <option value="25">Slippage: 50%</option>
                      <option value="35">Slippage: 70%</option>
                      <option value="50">Slippage: 100%</option>
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
                <span className="text-gray-600 text-xl">${fromPrice}</span>
              </div>
            </section>

            <section className={hm.toSwapContainer}>
              <button id="to" onClick={open_close} className={hm.SwapButton}>
                <Image src={toTokenImage} width="240" height="240" alt="logo" />
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
                <span className="text-gray-600 text-xl">${toPrice}</span>
              </div>
            </section>
            <div className={"my-3 " + hm.connectButtonContainer}>
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
    <Note>
     <h1 className="text-4xl font-bold">
          Buy <span className="text-green-400">DPO</span> tokens using crypto
        </h1>
        <h2 className="text-md my-4 text-2xl">DPO Global LLC: Tokens Available Here</h2>
        <p>Price: $40 USD per token, less 13% discount to market = $34.82</p>
      <Link className="px-4 py-2 bg-blue-500 text-xl text-white" href="https://nowpayments.io/payment/?iid=4425132678">Buy DPO via crypto</Link>
    </Note>
    </>
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
  const clientID=process.env.CLIENTID
  return {
    props: { apikey,clientID },
  };
}
