import '../styles/globals.css'

import { AuthContextProvider } from '../stores/authContext'
import Temp from '../comps/Temp'


function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Temp/>
      <Component {...pageProps} />
    </AuthContextProvider>
  )
}

export default MyApp
