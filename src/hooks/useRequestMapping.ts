import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { useCallback, useEffect, useState } from 'react'

import { useAppContext } from '../state/context'
import { useInterval } from './useInterval'

export const useRequestMapping = () => {
  const { publicKey } = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { setAccountInfo } = useAppContext()

  const url =
    'https://api.explorer.aleo.org/v1/testnet3/program/credits.aleo/mapping/account'

  const getMapping = useCallback(() => {
    if (!publicKey) return
    setLoading(true)
    fetch(`${url}/${publicKey}`)
      .then((response) => response.json())
      .then((data: any) => {
        setAccountInfo((prevState) => {
          if (!data || data === prevState.mapping) return prevState
          return { ...prevState, mapping: data }
        })
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false))
  }, [publicKey])

  useEffect(() => {
    getMapping()
  }, [publicKey])

  // useInterval(getMapping, 60000)

  return { loading, error }
}
