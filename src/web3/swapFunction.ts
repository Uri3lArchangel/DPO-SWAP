// import Moralis from 'moralis'
// let isStarted = false


// export async function fetchBalances(addr:string,key:string){
// if(key){
//     if(!isStarted){
// await Moralis.start({apiKey:key})
// isStarted=true
//     }
// if(addr != ''){
// const response=await Moralis.EvmApi.balance.getNativeBalance({
//     address:`${addr}`,
//     chain:42161
// })


// return (parseFloat(response.raw.balance)/1E18).toFixed(4)
// }
// }
// }