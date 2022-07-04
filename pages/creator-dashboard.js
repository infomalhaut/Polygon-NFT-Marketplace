import { ethers } from "ethers";
import axios from 'axios';
import Web3Modal from 'web3modal'
import { useState, useEffect, useContext } from "react";

import { nftContractAddress, nftMarketplaceAddress } from "../config"

//abi
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import AuthContext from "../stores/authContext";

export default function CreatorDashboard(){
    const [nfts, setNfts] = useState([])
    const [sold,setSold] = useState([])

    const [loadingState,setLoadingState]=useState('not-loaded')
    useEffect(()=>{
        //val.walletConnect()
        loadNFTs()
    },[])
    const val = useContext(AuthContext)


    async function loadNFTs(){
        // const web3Modal = new Web3Modal()
        // const connection = await web3Modal.connect()
        // const provider = new ethers.providers.Web3Provider(connection)
        // const signer = provider.getSigner()

        const tokenContract = new ethers.Contract(nftContractAddress,NFT.abi,val.provider0)
        const marketContract = new ethers.Contract(nftMarketplaceAddress,NFTMarketplace.abi,val.signer0)
    
        //get data
        const data = await marketContract.fetchMyNFTs()
        //  console.log(data, marketContract.address)
        
        const items = await Promise.all(data.map(async i => {
          const tokenUri = await tokenContract.tokenURI(i.tokenId)
          const meta = await axios.get(tokenUri)
          let price = ethers.utils.formatUnits(i.price.toString(),'ether')
          let item ={
            price,
            tokenId: i.tokenId.toString(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          }
          return item
        }))
        const soldItems = items.filter(i=> i.sold)
        setSold(soldItems)
        setNfts(items)
        setLoadingState('loaded')
   }
   if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in your dashboard</h1>)

   return(
    <div>
        <div className="p-4">
            <h2 className="text-2xl py-2">Items Created</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {
                    nfts.map((nft,i)=>(
                        <div key={i} className="border shadow rounded-xl oveflow-hidden">
                            <img src={nft.image} className="rounded"/>
                            <div className="p-4 bg-black">
                                <p className="text-2xl font-bold text-white">Price - {nft.price}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
        <div className="px-4">
            {
                Boolean(sold.length) && (
                    <div>
                        <h2 className="text-2xl py-2">Items Created</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {
                    sold.map((nft,i)=>(
                        <div key={i} className="border shadow rounded-xl oveflow-hidden">
                            <img src={nft.image} className="rounded"/>
                            <div className="p-4 bg-black">
                                <p className="text-2xl font-bold text-white">Price - {nft.price}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
                    </div>
                )
            }
        </div>
    </div>
   )

}