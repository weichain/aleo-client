import { TransactionDetails } from '../types/transactionDetails'

export function createEmptyTransactionDetails(): TransactionDetails {
  return {
    id: '',
    metadata: {
      timestamp: 0,
      fee: 0,
      status: '',
    },
    distro: {
      program: '',
      function: '',
    },
    sender: {
      address: '',
      value: '',
    },
    receivers: [],
  }
}
