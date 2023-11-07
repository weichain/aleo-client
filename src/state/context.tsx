import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'

import { Record } from '../types/record'
import { TransferTypes } from '../types/transferTypes'

interface AppContextType {
  records: Record[]
  balanceAllRecords: string
  mapping: string
  transferType: TransferTypes
  setRecords: Dispatch<SetStateAction<Record[]>>
  setMapping: Dispatch<SetStateAction<string>>
  setBalanceAllRecords: Dispatch<SetStateAction<string>>
  setTransferType: Dispatch<SetStateAction<TransferTypes>>
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider = ({ children }: any) => {
  const [records, setRecords] = useState<Record[]>([])
  const [mapping, setMapping] = useState<string>('0')
  const [balanceAllRecords, setBalanceAllRecords] = useState<string>('0')
  const [transferType, setTransferType] = useState<TransferTypes>(
    TransferTypes.private
  )

  return (
    <AppContext.Provider
      value={{
        records,
        mapping,
        balanceAllRecords,
        transferType,
        setRecords,
        setMapping,
        setBalanceAllRecords,
        setTransferType,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = (): AppContextType | undefined => {
  const appContext = useContext(AppContext)
  return appContext
}
