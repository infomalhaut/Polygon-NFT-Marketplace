import { createContext, useEffect } from "react";
import { useState } from "react";
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'


const AuthContext = createContext({
    address0: null,
    provider0: null,
    signer0: null,
    walletConnect: ()=>{console.log("dsaafdds")},
    login:null,
    isConnected: false
})

export const AuthContextProvider = ({children}) =>{
    const [address0,setAddress0]=useState()
    const [provider0,setProvider0]=useState()
    const [signer0,setSigner0] = useState()
    const [isConnected, setConnected] = useState(false)

    const walletConnect0 = async() =>{
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        setProvider0(provider)
        setSigner0(signer)
        signer.getAddress().then(address =>{
          setAddress0(address)
        })
        setConnected(true)
       // console.log(address0)
       // console.log(provider,'a', provider0,'b')
       // console.log('hi')
    }
    // useEffect(()=>{
    //     walletConnect0()
    // },[])

    const context ={address0: address0, provider0: provider0, signer0:signer0, 
        walletConnect:walletConnect0, 
        login:walletConnect0,
        isConnected: isConnected}

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}
//export const AuthContextProvider=AuthContextProvider;
export default AuthContext;
//a0={address0} wc={walletConnect} p0={provider0} s0={signer0} ic={isConnected}
//{address0,walletConnect,provider0,signer0,isConnected}