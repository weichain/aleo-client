interface Data {
  microcredits: string
}

export interface Record {
  id: string
  owner: string
  program_id: string
  recordName: string
  data: Data
  spent: boolean
}
