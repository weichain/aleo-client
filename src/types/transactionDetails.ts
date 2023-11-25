export type Metadata = {
  timestamp: number
  fee: number
  status: string
}

type Distro = {
  program: string
  function: string
}

export type Account = {
  address: string
  value: string
}

export type TransactionDetails = {
  id: string
  metadata: Metadata
  distro: Distro
  sender: Account
  receivers: Account[]
}
