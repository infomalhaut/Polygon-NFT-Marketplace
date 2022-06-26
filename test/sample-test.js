const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
  it("Should check mint,sell,buy nfts on the marketplace", async function () {
    const Market = await ethers.getContractFactory("NFTMarketplace")
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('100','ether')

    await nft.createToken("https://www.mytokenlocation.com")
    await nft.createToken("https://www.mytokenlocation2.com")

    await market.createMarketItem(nftContractAddress,1,auctionPrice,{value: listingPrice})
    await market.createMarketItem(nftContractAddress,2,auctionPrice,{value: listingPrice})

    const [_, buyerAddress] = await ethers.getSigners() //underscore is like seller

    await market.connect(buyerAddress).createMarketSale(nftContractAddress,1,{value: auctionPrice}) //value herre is msg.value

    let items = await market.fetchMarketItems()
    items= await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId) //ERC721 inbuilt function
      let item ={
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    console.log('market items: ',items)
  });
});
