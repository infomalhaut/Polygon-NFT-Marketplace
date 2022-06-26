import { create as ipfsHttpClient } from "ipfs-http-client"
import { useState } from "react"
import { useRouter } from "next/router"


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
        const web3Modal = new web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        //create item
        let contract = new ethers.Contract(nftContractAddress, NFT.abi, signer)
        let transaction = await contract.createToken(url)
        let tx = await transaction.wait()
        
        let event = tx.events[0]
        let value = events.args[2]
        let tokenId = value.toNumber()

        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        contract = new ethers.Contract(nftMarketplaceAddress,NFTMarketplace.abi,signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toSTring()

        transaction = await contract.createMarketItem(nftContractAddress,tokenId, price, {value: listingPrice})
        await transaction.wait()
        router.push('/')
    }

    return(
        <div className="flex justify-center">

        </div>
    )
}