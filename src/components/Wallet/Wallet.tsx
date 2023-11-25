import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { useEffect } from 'react'

import { useAppContext } from '../../state/context'
import { createEmptyAccountInfo } from '../../utils/stateFactory'
import './Wallet.css'

const Wallet = () => {
  const { publicKey } = useWallet()
  const { accountInfo, setAccountInfo } = useAppContext()
  const { mapping, records, balanceRecords } = accountInfo
  const formattedMapping = parseFloat(mapping.replace('u64', '')) / 10 ** 6

  useEffect(() => {
    if (!publicKey) {
      setAccountInfo(createEmptyAccountInfo())
    }
    let balance0 = 0
    records.forEach((r: any) => {
      if (r.spent) return
      balance0 += parseInt(r.data.microcredits.replace('u64.private', ''))
    })
    setAccountInfo((prevState) => {
      if (parseInt(balanceRecords) === balance0) return prevState
      return {
        ...prevState,
        balanceRecords: String(balance0 / 10 ** 6),
      }
    })
  }, [publicKey, JSON.stringify(records)])

  return (
    <div className="wallet">
      <div className={`balances ${!publicKey && 'disable'}`}>
        <label>Balance</label>
        <span>Private: {balanceRecords} ALEO</span>
        <span>Public: {formattedMapping} ALEO</span>
        <span>
          Total:{' '}
          {(parseFloat(balanceRecords) + formattedMapping).toPrecision(6)} ALEO
        </span>
      </div>
      {!publicKey && <div>Connect wallet to show balance</div>}
    </div>
  )
}

export default Wallet
