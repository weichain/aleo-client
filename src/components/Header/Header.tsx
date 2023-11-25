// import the CSS file
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui'
import '@demox-labs/aleo-wallet-adapter-reactui/dist/styles.css'
import { memo } from 'react'
import { ExternalLink } from 'react-external-link'
import { Link } from 'react-router-dom'

import Logo from '../../assets/aleo.svg'
import { useRequestMapping } from '../../hooks/useRequestMapping'
import { useRequestRecords } from '../../hooks/useRequestRecords'
import { useRequestTransactionHistory } from '../../hooks/useRequestTransactionHistory'
import './Header.css'

const Header = memo(() => {
  Promise.allSettled([
    useRequestRecords(),
    useRequestMapping(),
    useRequestTransactionHistory(),
  ])
  return (
    <header className="header">
      <div className="logo">
        <Logo className="img-logo" />
      </div>
      <div className="start">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <ExternalLink href={`https://explorer.aleo.org`} className="ext-link">
          Explorer
        </ExternalLink>
        <Link to="/transactions" className="nav-link">
          Transactions
        </Link>
      </div>
      <WalletMultiButton className="bg-[#1253fa]" />
    </header>
  )
})

export default Header
