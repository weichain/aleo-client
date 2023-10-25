import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useEffect, useState } from "react";


export const useRequestTransactionHistory = () => {
    const { publicKey, requestTransactionHistory } = useWallet()
    const [txHistory, setTxHistory] = useState<any>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // if (!publicKey) throw new WalletNotConnectedError();

    useEffect(() => {
        if (!publicKey) return;
        setLoading(true)
        // fetch(`https://vm.aleo.org/api/testnet3/program/credits.aleo/mapping/account/${publicKey}`)
        requestTransactionHistory!('credits.aleo')
            .then((data: any) => {
                // const recordsFormatted = recs.filter((rec: any) => rec.spent === false)
                // .map((rec) => JSON.stringify(rec, null, 2));
                setTxHistory(data)
                setLoading(false)
            })
            .catch((e) => {
                setError(e)
                setLoading(false)
            })
    }, [])
    
    
    return { txHistory, loading, error };
}