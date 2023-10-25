import { useEffect, useState } from 'react';
// import './Wallet.css';
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useRequestTransactionHistory } from '../../hooks/useRequestTransactionHistory';
import "./TransactionHistory.css";
import TransactionTable from '../TransactionTable/TransactionTable';

const TransactionHistory = () => {
  const { publicKey, getExecution } = useWallet();
  const [txs, setTxs] = useState([
    {id:"at1cqgrqjmw3mszgpcmne7ywn274qu4ve8a5du8ds5u93q5taevkq8sgxth8w"},
    {id:"as1rcdluuas0s5d9awjg965mq670f65tecgl6pu95wj8zxrpalfcgpqw0dhlk"},
    {id:"as1rcdluuas0s5d9awjg965mq670f65tecgl6pu95wj8zxrpalfcgpqw0dhlk"},
    {id:"as1rcdluuas0s5d9awjg965mq670f65tecgl6pu95wj8zxrpalfcgpqw0dhlk"},
    {id:"as1rcdluuas0s5d9awjg965mq670f65tecgl6pu95wj8zxrpalfcgpqw0dhlk"},
  ]);
  const { txHistory, loading, error } = useRequestTransactionHistory();

  useEffect(() => {
    if (
      !publicKey ||
      loading ||
      error ||
      !txHistory ||
      txHistory.length === 0 ||
      !getExecution
    )
      return;

    console.log("txHistory", txHistory);
    console.log(JSON.stringify(txHistory.map((t: any) => t)[2]));
    // Promise.all()
    getExecution(txHistory[0].id)
      .then((data: any) => {
        console.log("data", data);
      })
      .catch((e: any) => {
        console.log("e", e);
      });
  }, [txHistory]);

  return (
    <div className="tx-history">
      <label>Transaction History</label>
      {/* Use the new component to render the table with txs as data */}
      <TransactionTable data={txs} />
    </div>
  );
};


export default TransactionHistory;
