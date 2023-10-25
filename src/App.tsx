import React, { useMemo } from 'react';
import './App.css'
import Home from './pages/Home/Home'
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import { WalletProvider } from '@demox-labs/aleo-wallet-adapter-react';
import { DecryptPermission, WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base';
import { WalletModalProvider } from '@demox-labs/aleo-wallet-adapter-reactui';
import { RecordsContextProvider } from './state/context';

function App() {
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: "Leo Transfer App",
      }),
    ],
    []
  );
  return (
    <WalletProvider
      wallets={wallets}
      decryptPermission={DecryptPermission.OnChainHistory}
      programs={['credits.aleo']}
      network={WalletAdapterNetwork.Testnet}
      autoConnect
    >
      <WalletModalProvider>
       <RecordsContextProvider>
        <Home />
       </RecordsContextProvider>
      </WalletModalProvider>
    </WalletProvider>
  );
}

export default App;
