import React from 'react'
import './Header.css' // import the CSS file
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui'
import logo from './svg/aleo.svg'
import { ExternalLink } from 'react-external-link'

require('@demox-labs/aleo-wallet-adapter-reactui/dist/styles.css')

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} className="img-logo" alt="Logo" />
      </div>
      <div className="start">
        <span className="nav-link">Home</span>
        {/* {/* <span className="nav-link">Transactions</span> */}
        <ExternalLink href={`https://explorer.aleo.org`} className="ext-link">
          Explorer
        </ExternalLink>
      </div>
      <WalletMultiButton className="bg-[#1253fa]" />
    </header>
  )
}

export default Header
