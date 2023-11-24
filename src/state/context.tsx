import {
  Dispatch,
  SetStateAction,
  createContext,
  memo,
  useContext,
  useState,
} from 'react'

import { AccountInfo } from '../types/accountInfo'
import { TransactionHistory } from '../types/transactionHistory'
import { TransactionInfo, TransferTypes } from '../types/transactionInfo'
import {
  createEmptyAccountInfo,
  createEmptyTransactionInfo,
} from '../utils/stateFactory'

interface AppContextType {
  accountInfo: AccountInfo
  transactionInfo: TransactionInfo
  transactionHistory: TransactionHistory[]
  setAccountInfo: Dispatch<SetStateAction<AccountInfo>>
  setTransactionInfo: Dispatch<SetStateAction<TransactionInfo>>
  setTransactionHistory: Dispatch<SetStateAction<TransactionHistory[]>>
}

export const AppContext = createContext<AppContextType>({} as AppContextType)

export const AppContextProvider = memo(({ children }: any) => {
  const [accountInfo, setAccountInfo] = useState<AccountInfo>(
    createEmptyAccountInfo()
  )
  const [transactionInfo, setTransactionInfo] = useState<TransactionInfo>(
    createEmptyTransactionInfo()
  )
  const [transactionHistory, setTransactionHistory] = useState<
    TransactionHistory[]
  >([])
  return (
    <AppContext.Provider
      value={{
        accountInfo,
        transactionInfo,
        transactionHistory,
        setAccountInfo,
        setTransactionInfo,
        setTransactionHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  )
})

export const useAppContext = (): AppContextType => {
  const appContext = useContext(AppContext)
  return appContext
}
