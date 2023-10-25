import React from 'react';
import './Header.css'; // import the CSS file
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';
import logo from './svg/aleo.svg';

require('@demox-labs/aleo-wallet-adapter-reactui/dist/styles.css');

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} className='img-logo' alt="Logo" />
      </div>
        <div className="start">
          <span className="nav-link">Home</span>
          <span className="nav-link">Transactions</span>
          <span className="nav-link">Wallet</span>
        </div>
        <WalletMultiButton className="bg-[#1253fa]" />
    </header>
  );
};

export default Header;
