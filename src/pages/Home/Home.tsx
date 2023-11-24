import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { useEffect, useState } from 'react'

import { Button } from '../../components/Button/Button'
import CreateTransaction from '../../components/CreateTransaction/CreateTransaction'
import Header from '../../components/Header/Header'
import TransactionHistory from '../../components/TransactionHistory/TransactionHistory'
import Wallet from '../../components/Wallet/Wallet'
import './Home.css'

const Home = () => {
  const [showCreateTx, setCreateTx] = useState(false)

  const handleCreateNewTransaction = () => {
    setCreateTx(!showCreateTx)
  }

  return (
    <div className="home">
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
        {showCreateTx && <CreateTransaction />}
        <div>
          <p className="wallet-label">Wallet</p>
          <div className="info-wrapper">
            <Wallet />
            <TransactionHistory />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
