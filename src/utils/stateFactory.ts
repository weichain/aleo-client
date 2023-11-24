import { AccountInfo } from '../types/accountInfo'
import { TransactionInfo, TransferTypes } from '../types/transactionInfo'

export function createEmptyTransactionInfo(): TransactionInfo {
  return {
    transferType: TransferTypes.private,
    transactionInputs: { amounts: [], recipients: [] },
    feePrivate: true,
  }
}

export function createEmptyAccountInfo(): AccountInfo {
  return {
    records: [],
    mapping: '0',
    balanceRecords: '0',
  }
}
