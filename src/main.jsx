import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react"
import { AuthProvider } from './context/AuthContext.jsx'

const config = defineConfig({
  initialColorMode: "light",
  useSystemColorMode: false,
  styles: {
    global: {
      body: {
        bg: "white",
        color: "black",
      },
    },
  },
})

const system = createSystem(defaultConfig, config)



createRoot(document.getElementById('root')).render(
  <StrictMode>

    <ChakraProvider value={system}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraProvider>

  </StrictMode>,
)
