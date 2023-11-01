import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { useEffect, useState } from 'react'

export const useRequestTransactionHistory = () => {
  const { publicKey, requestTransactionHistory } = useWallet()
  const [txHistory, setTxHistory] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // if (!publicKey) throw new WalletNotConnectedError();
  const getTxHistory = async () => {
    if (!publicKey) return
    requestTransactionHistory!('credits.aleo')
      .then((data: any) => {
        // const recordsFormatted = recs.filter((rec: any) => rec.spent === false)
        // .map((rec) => JSON.stringify(rec, null, 2));
        setTxHistory(data)
        setLoading(false)
      })
      .catch((e) => {
        setError(e)
        setLoading(false)
      })
    await new Promise(f => setTimeout(f, 15000));
    getTxHistory()
  }

  useEffect(() => {
    setLoading(true)
    getTxHistory()
  }, [publicKey])

  return { txHistory, loading, error }
}
