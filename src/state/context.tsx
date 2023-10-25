import { useState, createContext, SetStateAction, Dispatch, useContext } from "react";
import { Record } from "../types/record";

interface RecordsContextType {
    records: Record[]
    setRecords: Dispatch<SetStateAction<Record[]>>
}

export const RecordsContext = createContext<RecordsContextType | undefined>(undefined)

export const RecordsContextProvider = ({children}: any) => {
    const [records, setRecords] = useState<Record[]>([]); 
    return (
        <RecordsContext.Provider value={{records, setRecords}}>
            {children}
        </RecordsContext.Provider>
    );
}

export const useRecordsContext = (): RecordsContextType | undefined => {
    const recordsContext = useContext(RecordsContext);
    return recordsContext;
};