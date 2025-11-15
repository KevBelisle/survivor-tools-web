import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Navigate, Route } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'

import AppFooter from './components/AppFooter'
import AppVersion from './components/AppVersion'
import KickstarterArchives from './kickstarter-archives'
import NewsletterArchives from './newsletter-archives'
import * as serviceWorker from './serviceWorker'
import ShopArchives from './shop-archives'

import './index.css'

const queryClient = new QueryClient()

const system = createSystem(defaultConfig, {
  theme: {
    breakpoints: {
      sm: '724px', // 2 columns
      md: '1064px', // 3 columns
      lg: '1404px', // 4 columns
      xl: '1744px', // 5 columns
      '2xl': '2084px', // 6 columns
    },
  },
  recipes: {
    container: {
      base: {
        px: 0,
        maxWidth: {
          base: '320px',
          sm: '660px',
          md: '1000px',
          lg: '1340px',
          xl: '1680px',
          '2xl': '2020px',
        },
      },
    },
  },
  globalCss: {
    html: {
      colorPalette: 'light',
    },
  },
})

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <ChakraProvider value={system}>
          <BrowserRouter>
            <Routes>
              <Route path="/newsletter/*" element={<NewsletterArchives />} />
              <Route path="/kickstarter/*" element={<KickstarterArchives />} />
              <Route path="/shop/*" element={<ShopArchives />} />
              <Route path="/" element={<Navigate to="/shop" replace />} />
            </Routes>
            <AppFooter />
            <AppVersion />
          </BrowserRouter>
        </ChakraProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
