import {
  DecryptPermission,
  WalletAdapterNetwork,
} from '@demox-labs/aleo-wallet-adapter-base'
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo'
import { WalletProvider } from '@demox-labs/aleo-wallet-adapter-react'
import { WalletModalProvider } from '@demox-labs/aleo-wallet-adapter-reactui'
import React, { useMemo } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.css'
import Header from './components/Header/Header'
import Home from './pages/Home/Home'
import Transactions from './pages/Transacions/Transactions'
import { AppContextProvider } from './state/context'

function App() {
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: 'Leo Transfer App',
      }),
    ],
    []
  )
  return (
    <BrowserRouter>
      <WalletProvider
        wallets={wallets}
        decryptPermission={DecryptPermission.OnChainHistory}
        programs={['credits.aleo', 'distrofund_private_transfer.aleo']}
        network={WalletAdapterNetwork.Testnet}
        autoConnect
      >
        <WalletModalProvider>
          <AppContextProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/transactions" element={<Transactions />} />
            </Routes>
          </AppContextProvider>
        </WalletModalProvider>
      </WalletProvider>
    </BrowserRouter>
  )
}

export default App
