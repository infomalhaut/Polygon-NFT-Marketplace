import { ethers } from "ethers";
import axios from 'axios';
import Web3Modal from 'web3modal'
import { useState, useEffect, useContext } from "react";


import { nftContractAddress, nftMarketplaceAddress } from "../config"

//abi
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import AuthContext from "../stores/authContext";


export default function MyAssets({provider0, signer0}){
    const [nfts,setNfts]=useState([])
    const [loadingState,setLoadingState]=useState('not-loaded')
    const val = useContext(AuthContext)

    useEffect(()=>{
        //val.walletConnect()
        loadNFTs()
      },[])

      

    
      async function loadNFTs(){
        // const web3Modal = new Web3Modal()
        // const connection = await web3Modal.connect()
        // const provider = new ethers.provider0s.Web3provider(connection)
        // const signer = provider.getsigner()

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
        // console.log("1",items)
        setNfts(items)
        setLoadingState('loaded')
        // console.log(loadingState);
      }
      if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in your collection</h1>)

  return (
    <div className='flex justify-center'>
      <div className='px-4' style={{maxWidth: '1600px'}}>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
          {
            nfts.map((nft,i)=>(
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image}/>
                <div className='p-4'>
                  <p className='text-3xl font-bold'>{nft.name}</p>
                  <p className='text-xl text-gray-400'>{nft.description}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )

}