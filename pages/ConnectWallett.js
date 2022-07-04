import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnect from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import { useState } from 'react';

export const providerOptions = {
 coinbasewallet: {
   package: CoinbaseWalletSDK, 
   options: {
     appName: "Web 3 Modal Demo",
   }
 },
 walletconnect: {
   package: WalletConnect, 
   options: {
   }
 }
};


const web3Modal = new Web3Modal({
  providerOptions // required
});

export default function ConnectWallett() {

    const [provider, setProvider] = useState();
    const [library, setLibrary] = useState();
  
    const connectWallet = async () => {
      try {
        const provider = await web3Modal.connect();
        const library = new ethers.providers.Web3Provider(provider);
        setProvider(provider);
        setLibrary(library);
      } catch (error) {
        console.error(error);
      }
    };
    
   return (
     <div className="">
         <button onClick={connectWallet}>Connect Wallet</button>  
      </div>
   );
  }