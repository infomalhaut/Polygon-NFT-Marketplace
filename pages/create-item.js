import { create as ipfsHttpClient } from "ipfs-http-client"
import { useState } from "react"
import { useRouter } from "next/router"
import Web3Modal from 'web3modal'


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import { nftContractAddress, nftMarketplaceAddress } from "../config"

//abi
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import { ethers } from "ethers"


export default function CreateItem(){
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput,setFormInput] = useState({price: '',name: '', description: ''})
    const router = useRouter()

    async function onChange(e){ //create and save file to ipfs
        const file = e.target.files[0]
        try{
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileUrl(url)
        }catch(e){
            console.log(e)
        }
    }

    async function uploadToIPFS(){
        const {name,description, price} = formInput
        if(!name || !description || !price) return

        const data = JSON.stringify({  //? price
            name,description,image:fileUrl
        })
        try{
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            return url
        }catch(error){
            console.log(error)
        }
    }

    async function createSale(){
        const url = uploadToIPFS()
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        //create item
        let contract = new ethers.Contract(nftContractAddress, NFT.abi, signer)
        let transaction = await contract.createToken(url)
        let tx = await transaction.wait()
        
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()

        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        contract = new ethers.Contract(nftMarketplaceAddress,NFTMarketplace.abi,signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()

        transaction = await contract.createMarketItem(nftContractAddress,tokenId, price, {value: listingPrice})
        await transaction.wait()
        router.push('/')
    }

    return(
        <div className="flex justify-center">
            <div className="w-1/2 flex flex-col pb-12">
                <input 
                  placeholder="Asset Name"
                  className="mt-8 border rounded p-4"
                  onChange={(e)=>{setFormInput({...formInput, name: e.target.value})}}
                />
                <textarea 
                  placeholder="Description"
                  className="mt-2 border rounded p-4"
                  onChange={(e)=>{setFormInput({...formInput, description: e.target.value})}}
                />
                <input 
                  placeholder="Price"
                  className="mt-3 border rounded p-4"
                  onChange={e=>setFormInput({...formInput, price: e.target.value})}
                />
                <input 
                 type="file"
                 name="Asset(picture,audio file etc)"
                 className="mt-4"
                 onChange={onChange}
                />
                {
                    fileUrl && (
                        <img className="rounded mt-4" width="350" src={fileUrl}/>
                    )
                }
                <button onClick={createSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shawdow-lg">
                    Create Digital Asset
                </button>
            </div>
        </div>
    )
}