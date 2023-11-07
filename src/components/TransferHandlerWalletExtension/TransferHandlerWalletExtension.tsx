import { Transaction } from '@demox-labs/aleo-wallet-adapter-base'
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'

import { useAppContext } from '../../state/context'
import { TransferTypes } from '../../types/transferTypes'
import Button from '../Button/Button'
import './TransferHandlerWalletExtension.css'
import { privateTransfer } from './transferTypeHandlers/private'

interface TransferHandlerWalletExtensionProps {
  recipients: string[]
  amounts: number[]
  setSubmitError: (error: any) => void
  setTransactionId: (txId: string) => void
}

export const TransferHandlerWalletExtension = ({
  recipients,
  amounts,
  setSubmitError,
  setTransactionId,
}: TransferHandlerWalletExtensionProps) => {
  const { publicKey, wallet } = useWallet()
  const { transferType, records } = useAppContext()!
  const _transferType = transferType as string
  if (!publicKey) {
    setSubmitError('Please connect Leo Wallet.')
    return
  }

  const handleSubmit = async () => {
    try {
      let aleoTransaction: Transaction | null = null
      switch (_transferType) {
        case TransferTypes.private:
          aleoTransaction = privateTransfer(
            records,
            recipients,
            amounts,
            publicKey
          )
          break
        default:
          throw new Error('Unimplemented transfer')
      }
      if (!aleoTransaction) {
        setSubmitError(
          new Error('Could not build Aleo transaction. Please try again.')
        )
        return
      }
      const txId =
        (await (wallet?.adapter as LeoWalletAdapter).requestTransaction(
          aleoTransaction
        )) || ''
      setTransactionId(txId)
    } catch (e) {
      setSubmitError(e)
    }
  }

  return (
    <Button
      className="submit-btn"
      onClick={handleSubmit}
      text="Submit"
    ></Button>
  )
}
