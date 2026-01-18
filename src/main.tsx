import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@mantine/core/styles.css'

import theme from './theme.ts';

import { MantineProvider } from '@mantine/core';
import { AuthProvider } from './context/AuthContext.tsx';
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <MantineProvider theme={theme} forceColorScheme='light'>
    <AuthProvider>
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    </AuthProvider>
  </MantineProvider>
)
