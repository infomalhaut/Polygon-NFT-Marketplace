import React from "react";
import Link from 'next/link' //To link pages to components
import Web3Modal from 'web3modal'
import { useEffect, useState,useContext } from 'react'
import { ethers } from 'ethers'
import { NavButton } from './NavButton'
import AuthContext from '../stores/authContext'

const Temp=()=>{
    const val = useContext(AuthContext)
    return(
        <nav className='border-b p-6 bg-black'>
        <div className='flex justify-between'>
          <p className='text-4xl font-bold text-white'>NFT Marketplace</p>
          {val.isConnected ? (
              <div>
                <a href="#_" className="border-2 border-indigo-100 px-5 py-2.5 font-medium bg-blue-50 hover:bg-blue-100 hover:text-blue-600 text-blue-500 rounded-lg text-sm">
                {`${val.address0?.substring(0,10)}...`}
                </a>
              </div>
          ):(
            <button className="border-2 border-indigo-100 px-5 py-2.5 font-medium bg-blue-50 hover:bg-blue-100 hover:text-blue-600 text-blue-500 rounded-lg text-sm" 
              onClick={()=>{val.walletConnect()}}>
                  Connect Wallet
            </button>
          )}
        </div>
        <div className='text-white mt-4'>
          <Link href="/">
            <a className='mr-4 text-pink-500'>
              Home
            </a>
          </Link>
          <Link href="/create-item">
            <a className='mr-4 text-pink-500'>
              Mint and Sell Assets
            </a>
          </Link>
          <Link href="/my-items">
            <a className='mr-4 text-pink-500'>
              My Asset Collection
            </a>
          </Link>
          <Link href="/creator-dashboard">
            <a className='mr-4 text-pink-500'>
              Creator Dashboard
            </a>
          </Link>
        </div>
      </nav>
    );
}

export default Temp