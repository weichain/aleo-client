import { WalletNotConnectedError } from "@demox-labs/aleo-wallet-adapter-base";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useEffect, useState } from "react";
import { useRecordsContext } from "../state/context";


export const useRequestRecords = () => {
    const { publicKey, requestRecords } = useWallet()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    const { records, setRecords } = useRecordsContext()!;
    
    // if (!publicKey) throw new WalletNotConnectedError();

    useEffect(() => {
        if (!publicKey) return;
        setLoading(true)
        requestRecords!('credits.aleo')
            .then((value: any) => {
                setRecords(value.filter((r: any) => !r.spent))
                setLoading(false)
            })
            .catch((e) => {
                setError(e)
                setLoading(false)
            })
    }, [])
    
    
    return { records, loading, error };
}