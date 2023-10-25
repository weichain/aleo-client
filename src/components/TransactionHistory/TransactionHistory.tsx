import { useEffect, useState } from 'react'
// import './Wallet.css';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { useRequestTransactionHistory } from '../../hooks/useRequestTransactionHistory'
import './TransactionHistory.css'
import TransactionTable from '../TransactionTable/TransactionTable'

const TransactionHistory = () => {
  const { publicKey, getExecution } = useWallet()
  const [txs, setTxs] = useState([
    { id: 'at1yw56267v4ame6dsdcrj8rnewgen2kdchr8vn5nvxmcq82mzl65rqv5svs2' },
    { id: 'at123dsq0sfa09n08mfy3234ee5t4mxvxxpen9nxqt0jmfn8jh5ucxs40q4mn' },
    { id: 'at16zq5hqkekvarfzvmh4phlx0y34wvt6ph6yut6u0l436fr9r7ycxszfeds2' },
    { id: 'at1npxw8gfsfs3ul8pwupkfr6az7wcuy2sfz0swjkjk6xtx3x6egc8s4shln4' },
    { id: 'at1fj5m3zfjjaa5vtg0em6ske5u59c43mx0v2jvjledrywk2rny8vzqghvz4d' },
  ]) //dummy txs until wallet extension is fixed

  const { txHistory, loading, error } = useRequestTransactionHistory()

  useEffect(() => {
    if (
      !publicKey ||
      loading ||
      error ||
      !txHistory ||
      txHistory.length === 0 ||
      !getExecution
    )
      return

    getExecution(txHistory[0].id)
      .then((data: any) => {
        console.log('data', data)
      })
      .catch((e: any) => {
        console.log('e', e)
      })
  }, [txHistory])

  return (
    <div className="tx-history">
      <label>Transaction History</label>
      <TransactionTable data={publicKey ? txs : []} />
      {!publicKey && <div>Connect wallet to show transactions</div>}
    </div>
  )
}

export default TransactionHistory
