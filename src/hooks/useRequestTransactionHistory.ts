import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useAppContext } from '../state/context'
import { useInterval } from './useInterval'

export const useRequestTransactionHistory = () => {
  const { publicKey, requestTransactionHistory } = useWallet()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { setTransactionHistory } = useAppContext()

  const fetchTransactionHistory = useCallback(() => {
    if (!publicKey) return
    setLoading(true)
    // requestTransactionHistory!('credits.aleo')
    requestTransactionHistory!('distrofund_private_transfer.aleo')
      .then((data: any) => {
        setTransactionHistory((prevState) => {
          if (!data || prevState.length === data.length) return prevState
          return data
        })
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false))
  }, [publicKey])

  useEffect(() => {
    fetchTransactionHistory()
  }, [publicKey])

  useInterval(fetchTransactionHistory, 60000)

  return { loading, error }
}
