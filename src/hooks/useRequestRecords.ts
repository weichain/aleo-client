import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { useCallback, useEffect, useState } from 'react'

import { useAppContext } from '../state/context'
import { useInterval } from './useInterval'

export const useRequestRecords = () => {
  const { publicKey, requestRecords } = useWallet()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { accountInfo, setAccountInfo } = useAppContext()

  const getRecords = useCallback(() => {
    if (!publicKey) return
    setLoading(true)
    requestRecords!('credits.aleo')
      .then((value: any) => {
        const unspent = value?.filter((r: any) => !r.spent)
        setAccountInfo((prevState) => {
          if (!unspent || prevState.records.length === unspent.length)
            return prevState
          return {
            ...prevState,
            records: unspent,
          }
        })
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false))
  }, [publicKey])

  useEffect(() => {
    getRecords()
  }, [publicKey])

  useInterval(getRecords, 60000)

  return { loading, error }
}
