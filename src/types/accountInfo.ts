import { Dispatch, SetStateAction } from "react"
import { Record } from "./record"

export type AccountInfo = {
  records: Record[]
  mapping: string
  balanceRecords: string
}