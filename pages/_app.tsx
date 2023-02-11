import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { darkTheme, lightTheme } from '../themes'
import { SWRConfig } from 'swr'
import { UIProvider } from '@/context'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SWRConfig
        value={{
          fetcher: (resource, init) => fetch(resource, init).then( res => res.json())
        }}
      >
        <UIProvider>
          <ThemeProvider
            theme={lightTheme}
          >
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </UIProvider>
      </SWRConfig>
    </>
  )
}
