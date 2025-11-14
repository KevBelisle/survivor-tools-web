import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'
import { withAITracking } from '@microsoft/applicationinsights-react-js'
import React from 'react'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom'

import { reactPlugin } from './appInsights'
import AppFooter from './components/AppFooter'
import AppVersion from './components/AppVersion'
import KickstarterArchives from './kickstarter-archives'
import NewsletterArchives from './newsletter-archives'
import * as serviceWorker from './serviceWorker'
import ShopArchives from './shop-archives'

import './index.css'

const queryClient = new QueryClient()

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  breakpoints: createBreakpoints({
    sm: '724px', // 2 columns
    md: '1064px', // 3 columns
    lg: '1404px', // 4 columns
    xl: '1744px', // 5 columns
    '2xl': '2084px', // 6 columns
  }),
  components: {
    Container: {
      baseStyle: {
        px: '0',
        maxWidth: {
          base: '320px',
          sm: '660px',
          md: '1000px',
          lg: '1340px',
          xl: '1680px',
          '2xl': '2020px',
        },
      },
      sizes: {
        base: {},
        sm: {},
        md: {},
        lg: {},
        xl: {},
        '2xl': {},
      },
    },
  },
}
const theme = extendTheme(config)

const AppConfiguration = withAITracking(reactPlugin, () => (
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <QueryClientProvider client={queryClient}>
      <ChakraProvider resetCSS={true} theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route path="/newsletter">
              <NewsletterArchives />
            </Route>
            <Route path="/kickstarter">
              <KickstarterArchives />
            </Route>
            <Route path="/shop">
              <ShopArchives />
            </Route>
            <Route>
              <Redirect to="/shop" />
            </Route>
          </Switch>
          <AppFooter />
          <AppVersion />
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  </>
))

ReactDOM.render(
  <React.StrictMode>
    <AppConfiguration />
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
