import {
  Transaction,
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from '@demox-labs/aleo-wallet-adapter-base'
import {
  createAddressesInput,
  createAmountsInput,
} from '../../../utils/programInput'
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo'
import { Wallet } from '@demox-labs/aleo-wallet-adapter-react'
import { getTransitionsNames } from '../../../utils/transitionNames'

interface ValidateInputsParams {
  checkValidInputs: () => [string[], string[], Error | undefined]
  setSubmitError: (error: any) => void
  records: any[]
}

export const transformInputs = ({
  checkValidInputs,
  setSubmitError,
  records,
}: ValidateInputsParams): [any | void, string[], string[]] => {
  const [_recipients, _amounts, error] = checkValidInputs()
  if (error) {
    return [setSubmitError(error), [], []]
  }
  const fullSendAmount = _amounts
    .map((e: any) => parseInt(e))
    .reduce((acc: any, cur: any) => acc + cur)
  const amountRecords = records.map((r) =>
    parseInt(r.data.microcredits.replace('u64.private', ''))
  )
  let recordToSend
  for (let i = 0; i < records.length; i++) {
    const amountRec = amountRecords[i]
    if (amountRec < fullSendAmount) continue
    recordToSend = records[i]
  }
  if (!recordToSend) {
    recordToSend = new Error('Could not find record to send')
  }
  return [recordToSend, _recipients, _amounts]
}

interface HandleSubmitWalletExtensionParams {
  publicKey: string
  wallet: Wallet | null
  setTransactionId: (txId: string) => void
  recordToSend: any
  recipients: string[]
  amounts: string[]
  setSubmitError: (error: any) => void
}

export const handleSubmitWalletExtension = async ({
  publicKey,
  wallet,
  setTransactionId,
  recordToSend,
  recipients,
  amounts,
  setSubmitError,
}: HandleSubmitWalletExtensionParams) => {
  const inputs = [
    recordToSend,
    JSON.stringify(createAddressesInput(recipients)).replaceAll('"', ''),
    JSON.stringify(createAmountsInput(amounts)).replaceAll('"', ''),
  ]

  const transition = getTransitionsNames(recipients.length)
  const aleoTransaction = Transaction.createTransaction(
    publicKey,
    WalletAdapterNetwork.Testnet,
    'distrofund_private_transfer.aleo',
    transition,
    inputs,
    100000
  )

  try {
    const txId =
      (await (wallet?.adapter as LeoWalletAdapter).requestTransaction(
        aleoTransaction
      )) || ''
    setTransactionId(txId)
  } catch (e) {
    setSubmitError(e)
  }
}
