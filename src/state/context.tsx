import {
  useState,
  createContext,
  SetStateAction,
  Dispatch,
  useContext,
} from 'react'
import { Record } from '../types/record'

interface AppContextType {
  records: Record[]
  balanceAllRecords: string
  mapping: string
  setRecords: Dispatch<SetStateAction<Record[]>>
  setMapping: Dispatch<SetStateAction<string>>
  setBalanceAllRecords: Dispatch<SetStateAction<string>>
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider = ({ children }: any) => {
  const [records, setRecords] = useState<Record[]>([])
  const [mapping, setMapping] = useState<string>('0')
  const [balanceAllRecords, setBalanceAllRecords] = useState<string>('0')
  return (
    <AppContext.Provider
      value={{
        records,
        mapping,
        balanceAllRecords,
        setRecords,
        setMapping,
        setBalanceAllRecords,
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
