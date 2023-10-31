import { useEffect, useState } from 'react'
import Header from '../../components/Header/Header' // change this to your header component path
import './Home.css' // import the CSS file
import CreateTransaction from '../../components/CreateTransaction/CreateTransaction'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import Wallet from '../../components/Wallet/Wallet'
import { Button } from '../../components/Button/Button'
import TransactionHistory from '../../components/TransactionHistory/TransactionHistory'

const Home = () => {
  const { publicKey } = useWallet()
  const [showCreateTx, setCreateTx] = useState(false)
  const [showWalletInfo, setShowWalletInfo] = useState(false)
  console.log('publicKey', publicKey)

  const handleCreateNewTransaction = () => {
    setCreateTx(!showCreateTx)
  }

  useEffect(() => {
    setShowWalletInfo(publicKey ? true : false)
  }, [publicKey])

  return (
    <div className="home">
      <Header />
      <div className="inner-home">
        <h1 className="title">DistroFund Aleo</h1>
        <p className="subtitle">
          A blockchain-based asset transfer app with user-friendly interface.
        </p>
        <div className="center">
          <Button
            text="Create New Transaction"
            onClick={handleCreateNewTransaction}
          />
        </div>
        {showCreateTx && <CreateTransaction/>}
        <div>
          <p className="wallet-label">Wallet</p>
          <div className="info-wrapper">
            {/* {showWalletInfo && <Wallet />}
            {showWalletInfo && <TransactionHistory />} */}
            <Wallet />
            <TransactionHistory />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
