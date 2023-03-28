import Web3 from 'web3'
const arbitriumMainnetChainID = 42161
export let web3:Web3

export let errorObjectTemplate={
    state:'',
    reason:'',
    solution:'',
    errorID:0
}
const chainConfirm=async()=>{
    try{
    let chainID = await web3.eth.getChainId()
    if(chainID != arbitriumMainnetChainID){
        errorObjectTemplate.state='Failed' 
        errorObjectTemplate.reason='You are currently on the wrong chain '
        errorObjectTemplate.solution=`please switch to Arbitrium One Nitro which is ${arbitriumMainnetChainID}`
        errorObjectTemplate.errorID =-1
        alert(errorObjectTemplate.reason + errorObjectTemplate.solution)
    }
}catch(error){
    console.error(error)
}
}
const checkProvider=()=>{
    if(!window.ethereum){
        errorObjectTemplate.errorID=-2
        errorObjectTemplate.reason = 'Metamask not found'
        errorObjectTemplate.solution = 'Pease install metamask'
        errorObjectTemplate.state='Failed'
    }else{
        web3=new Web3(window.ethereum)
    }
}


const handleResponse=(a:string,ret:boolean)=>{
alert(a)

if(ret){
    return
}
}

export async function metamaskConnect(){
    checkProvider()
    chainConfirm()

if(errorObjectTemplate.errorID === -1){
    handleResponse(errorObjectTemplate.reason+errorObjectTemplate.solution,false)
}else if(errorObjectTemplate.errorID == -2){
    handleResponse(errorObjectTemplate.reason+errorObjectTemplate.solution,true)
}
try {

    let walletAddress = await web3.eth.requestAccounts()
 
    return walletAddress[0]!

} catch (error:any) {
   return ""
}
}


