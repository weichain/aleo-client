import './Header.css' // import the CSS file
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui'
import Logo from '../../assets/aleo.svg'
import { ExternalLink } from 'react-external-link'

import '@demox-labs/aleo-wallet-adapter-reactui/dist/styles.css'

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Logo className="img-logo" />
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
