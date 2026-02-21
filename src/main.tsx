import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/dropzone/styles.css'
import '@mantine/carousel/styles.css'

import theme from './theme.ts';

import { MantineProvider } from '@mantine/core';
import { AuthProvider } from './context/AuthContext.tsx';
import { BrowserRouter } from 'react-router'
import { ModalsProvider } from '@mantine/modals';

createRoot(document.getElementById('root')!).render(
  <MantineProvider theme={theme} forceColorScheme='light'>
    <ModalsProvider>
      <AuthProvider>
        <StrictMode>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </StrictMode>
      </AuthProvider>
    </ModalsProvider>
  </MantineProvider>
)
