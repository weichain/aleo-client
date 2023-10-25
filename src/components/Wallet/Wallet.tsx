import React, { useEffect, useState } from 'react'
import { useRequestRecords } from '../../hooks/useRequestRecords'
import './Wallet.css'
import { useRequestMapping } from '../../hooks/useRequestMapping'
import { useRequestTransactionHistory } from '../../hooks/useRequestTransactionHistory'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'

const Wallet = () => {
  const { publicKey } = useWallet()
  const [balanceRecords, setBalanceRecords] = useState('0')
  const [balanceMapping, setBalanceMapping] = useState('0')
  const { records } = useRequestRecords()
  const { mapping } = useRequestMapping()

  useEffect(() => {
    if (mapping) {
      setBalanceMapping(
        (Number(mapping.replace('u64', '')) / 10 ** 6).toString()
      )
    }
    if (records?.length > 0) {
      let balance0 = 0
      records?.forEach((r: any) => {
        if (r.spent) return
        balance0 += Number(r.data.microcredits.replace('u64.private', ''))
      })
      setBalanceRecords(String(balance0 / 10 ** 6))
    }
  }, [mapping, records])

  useEffect(() => {
    if (publicKey) return
    setBalanceMapping('0')
    setBalanceRecords('0')
  }, [publicKey])

  return (
    <div className="wallet">
      <div className={`balances ${!publicKey && 'disable'}`}>
        <label>Balance</label>
        <span>Private: {balanceRecords} ALEO</span>
        <span>Public: {balanceMapping} ALEO</span>
        <span>Total: {Number(balanceRecords + balanceMapping)} ALEO</span>
      </div>
      {!publicKey && <div>Connect wallet to show balance</div>}
    </div>
  )
}

export default Wallet
