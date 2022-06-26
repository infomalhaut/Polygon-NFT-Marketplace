import '../styles/globals.css'
import Link from 'next/link' //To link pages to components

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className='border-b p-6 bg-black'>
        <p className='text-4xl font-bold text-white'>NFT Marketplace</p>
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
          <Link href="/create-item">
            <a className='mr-4 text-pink-500'>
              My Asset Collection
            </a>
          </Link>
          <Link href="/creator-dashbord">
            <a className='mr-4 text-pink-500'>
              Creator Dashboard
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
