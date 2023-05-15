import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

export const priceFetch = async (key: string, addr: string) => {
  try{if (key) {
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey: key,
      });
    }
  }
  if(addr){
    let chain,address
    if(addr === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"){
        console.log('eth')
        chain = EvmChain.ETHEREUM;
        address = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
    }else{
        chain = EvmChain.ARBITRUM
         address = addr
    }
  console.log(address)

  const response = await Moralis.EvmApi.token.getTokenPrice({
    address,
    chain,
  });

  return (response.toJSON());
}}catch(err){
    console.error(err)
}
};
