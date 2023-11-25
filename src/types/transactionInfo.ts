export class TransferTypes {
  static private: string = 'private'
  static public: string = 'public'
  static privateToPublic: string = 'privateToPublic'
  static publicToPrivate: string = 'publicToPrivate'
}

export type TransactionInputs = {
  recipients: string[]
  amounts: number[]
  privateKey?: string
  record?: string
}

export type TransactionInfo = {
  transferType: TransferTypes
  transactionInputs: TransactionInputs
  feePrivate: boolean
}