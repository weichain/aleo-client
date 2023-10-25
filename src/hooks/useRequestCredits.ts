import { WalletNotConnectedError } from "@demox-labs/aleo-wallet-adapter-base";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useEffect, useState } from "react";


export const useRequestCredits = () => {
    const { publicKey, requestRecords } = useWallet()
    const [records, setRecords] = useState<any[]>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // if (!publicKey) throw new WalletNotConnectedError();

    useEffect(() => {
        if (!publicKey) return;
        setLoading(true)
        requestRecords!('credits.aleo')
        // requestRecords!('disperse_milion_test.aleo')
            .then((value: any) => {
                // .map((rec) => JSON.stringify(rec, null, 2));
                setRecords(value)
                setLoading(false)
            })
            .catch((e) => {
                setError(e)
                setLoading(false)
            })
    }, [])
    
    
    return { records, loading, error };
}