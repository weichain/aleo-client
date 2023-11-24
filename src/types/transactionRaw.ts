interface Transaction {
  type: string
  id: string
  execution: {
    transitions: Transition[]
    global_state_root: string
    proof: string
  }
  fee: Fee
}

interface Fee {
  transition: Transition
  global_state_root: string
  proof: string
}

interface Transition {
  id: string
  program: string
  function: string
  inputs: Input[]
  outputs: Output[]
  tpk: string
  tcm: string
}

interface Input {
  type: string
  id: string
  value: string
}

interface Output {
  type: string
  id: string
  checksum: string
  value: string
}

interface Fee {
  transition: Transition
  global_state_root: string
  proof: string
}

export interface Metadata {
  block_hash: string
  block_height: number
  block_timestamp: number
  transaction_index: number
  transaction_status: string
  transaction_fee: number
}

export interface TransactionRaw {
  transaction: Transaction
  fee: Fee
  metadata: Metadata
}
