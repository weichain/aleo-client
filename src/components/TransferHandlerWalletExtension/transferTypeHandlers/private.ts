import {
  Transaction,
  WalletAdapterNetwork,
} from '@demox-labs/aleo-wallet-adapter-base'

import { Record } from '../../../types/record'
import {
  createAddressesInput,
  createAmountsInput,
} from '../../../utils/programInput'
import { getSentRecord } from '../../../utils/recordToSend'
import { getTransitionsNames } from '../../../utils/transitionNames'

export const privateTransfer = (
  records: Record[],
  recipients: string[],
  amounts: number[],
  publicKey: string
): Transaction => {
  const recordToSend = getSentRecord({
    records,
    amounts,
  })
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
  return aleoTransaction
}
