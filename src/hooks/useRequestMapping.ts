import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { useEffect, useState } from 'react'

export const useRequestMapping = () => {
  const { publicKey } = useWallet()
  const [mapping, setMapping] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getMapping = async () => {
    if (!publicKey) return
    fetch(
      `https://vm.aleo.org/api/testnet3/program/credits.aleo/mapping/account/${publicKey}`
    )
      .then((response) => response.json())
      .then((data: any) => {
        setMapping(data ?? '0')
        setLoading(false)
      })
      .catch((e) => {
        setError(e)
        setLoading(false)
      })
    await new Promise(f => setTimeout(f, 15000));
    getMapping()
  }

  useEffect(() => {
    if (!publicKey) return
    setLoading(true)
    getMapping()
  }, [publicKey])

  return { mapping, loading, error }
}
