import styles from '../styles/Home.module.css'
import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { useState,useEffect } from 'react'

import { nftContractAddress,nftMarketplaceAddress } from '../config'

//abi
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function Home() {
  const [nfts,setNfts] = useState([])
  const [loadingState, setLoadingState]=useState('not loaded')

  useEffect(()=>{
    loadNFTs()
  },[])

  async function loadNFTs(){
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftContractAddress,NFT.abi,provider)
    const marketContract = new ethers.Contract(nftMarketplaceAddress,NFTMarketplace.abi,provider)

    //get data
    const data = await marketContract.fetchMarketItems()
    // console.log(data, marketContract.address)
    
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
  async function buyNft(nft){
    const web3modal = new Web3Modal()
    const connection = await web3modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftMarketplaceAddress,NFTMarketplace.abi,signer)

    const price = ethers.utils.parseUnits(nft.price.toString(),'ether')

    const transaction = await contract.createMarketSale(nftContractAddress,nft.tokenId,{value: price})
    await transaction.wait()

    loadNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)

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
                <div className='bg-black'>
                  <p className='text-4xl mb-4 font-bold text-white'>{nft.price} MATIC</p>
                  <button className='w-full bg-pink-500 text-white font-bold py-2 px-12 rounded' onClick={()=>buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
