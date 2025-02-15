import {BrowserRouter} from "react-router-dom"
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppContextProvider from "./context/AppContextProvider.jsx"
import { RecoilRoot } from "recoil"
import { SocketContextProvider } from "./context/SocketContext.jsx"

createRoot(document.getElementById('root')).render(
  <RecoilRoot>
  <BrowserRouter>
  <AppContextProvider>
    <SocketContextProvider>
    <App />
    </SocketContextProvider>

    </AppContextProvider>
  </BrowserRouter>
  </RecoilRoot>
 
)
