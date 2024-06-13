import React from 'react'
import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from '@next/third-parties/google'
import { ThemeProvider } from 'styled-components'
import { theme } from '../utils/theme'
import '../styles/global.css'

export default function App({ Component, pageProps }) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        <Analytics />
      </ThemeProvider>
    </>
  )
}
