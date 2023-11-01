import { WalletNotConnectedError } from '@demox-labs/aleo-wallet-adapter-base'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { useEffect, useState } from 'react'
import { useAppContext } from '../state/context'

export const useRequestRecords = () => {
  const { publicKey, requestRecords } = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { records, setRecords } = useAppContext()!

  const getRecords = async () => {
    if (!publicKey) return
    requestRecords!('credits.aleo')
      .then((value: any) => {
        console.log('value', value);
        console.log('value unspent', value.filter((r: any) => !r.spent));
        console.log('value spent', value.filter((r: any) => r.spent));
        
        setRecords(value.filter((r: any) => !r.spent))
        setLoading(false)
      })
      .catch((e) => {
        setError(e)
        setLoading(false)
      })
    await new Promise(f => setTimeout(f, 15000));
    getRecords()
  }

  useEffect(() => {
    if (!publicKey) return
    setLoading(true)
    getRecords()
  }, [publicKey])

  return { records, loading, error }
}
