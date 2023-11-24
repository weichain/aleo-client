import { useLocalStorage } from '@demox-labs/aleo-wallet-adapter-react'
import { useEffect, useMemo, useState } from 'react'

import { useAppContext } from '../state/context'
import { TransactionRaw } from '../types/transactionRaw'

export const useTransactionDetails = () => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { transactionHistory } = useAppContext()
  const url = 'https://api.explorer.aleo.org/v1/testnet3/explorer/transaction/'
  const [cachedTxs, setCachedTxs] = useLocalStorage<TransactionRaw[]>(
    'transactions',
    []
  )

  const memoized = useMemo(
    () => [...transactionHistory].reverse(),
    [JSON.stringify(transactionHistory)]
  )

  useEffect(() => {
    if (memoized.length !== cachedTxs.length) {
      const promises = Promise.allSettled([
        ...transactionHistory.map((tx) =>
          fetch(url + tx.transactionId).then((r) => r.json())
        ),
      ])
      promises.then((values) => {
        const txs: TransactionRaw[] = []
        values.forEach((v) => {
          if (v.status === 'fulfilled') {
            const tx = v.value as TransactionRaw
            txs.push(tx)
          }
        })
        setCachedTxs(txs)
      })
    }
  }, [memoized, cachedTxs])

  return { loading, error }
}

// decrypt(
//   'ciphertext1qgqwldnth8tlza5etm27p22e3sqgytstf2rxv8aw8h0kgvjefafnsq4prdygtp92llxd887j0a6fcfz763u95ev58p3s0hrpcxx9klzmquc0u8aq',
//   '6738517115387830853608472537601973573187541276509748351190374211617923224182group',
//   'credits.aleo',
//   'transfer_private',
//   1
// ).then((v) => console.log('v1', v))

// decrypt(
//   'ciphertext1qyqzcy5qeppuag0ajetfhkgz942qg22tclnd49a8w0593tz069rukzcy3l9ks',
//   '6738517115387830853608472537601973573187541276509748351190374211617923224182group',
//   'credits.aleo',
//   'transfer_private',
//   2
// ).then((v) => console.log('v1', v))

// decrypt(
//   'ciphertext1qgqxhjdsgjzssku4fc2law0etmrjn5yp9h85sx84aa3xh69jprk7sz5rf9gqhcgmz4a2s8vqvfu2uln6vfex4t8gzjg4w7mq5fcrpks4pvpcy6nq',
//   '551909214663170855707786404392049638793298072215421408727951812640463626246group',
//   'distrofund_private_transfer.aleo',
//   'transfer_two',
//   2
// ).then((v) => console.log('v1', v))
