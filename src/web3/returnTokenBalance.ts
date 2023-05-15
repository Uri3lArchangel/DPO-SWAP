import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";


export const RTB = async (key:string,Address:string) => {
    if(key ){
        if(!Moralis.Core.isStarted){
    await Moralis.start({apiKey:key})
        }
    }
    if(Address){
  const address = Address;

  const chain = EvmChain.ARBITRUM;

  const response = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    chain,
  });

  console.log(response.toJSON());
}
};