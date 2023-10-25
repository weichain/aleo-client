// https://vm.aleo.org/api/testnet3/program/credits.aleo/mapping/account/aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9
import { WalletNotConnectedError } from "@demox-labs/aleo-wallet-adapter-base";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useEffect, useState } from "react";


export const useRequestMapping = () => {
    const { publicKey, requestRecords } = useWallet()
    const [mapping, setMapping] = useState<string>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // if (!publicKey) throw new WalletNotConnectedError();

    useEffect(() => {
        if (!publicKey) return;
        setLoading(true)
        fetch(`https://vm.aleo.org/api/testnet3/program/credits.aleo/mapping/account/${publicKey}`)
            .then((response) => response.json())
            .then((data: any) => {
                // const recordsFormatted = recs.filter((rec: any) => rec.spent === false)
                // .map((rec) => JSON.stringify(rec, null, 2));
                setMapping(data ?? '0')
                setLoading(false)
            })
            .catch((e) => {
                setError(e)
                setLoading(false)
            })
    }, [])
    
    
    return { mapping, loading, error };
}