import React, { useEffect, useState } from 'react';
import { useRequestRecords } from '../../hooks/useRequestRecords';
import './Wallet.css';
import { useRequestMapping } from '../../hooks/useRequestMapping';
import { useRequestTransactionHistory } from '../../hooks/useRequestTransactionHistory';

const Wallet = () => {
  const [balanceRecords, setBalanceRecords] = useState('0');
  const [balanceMapping, setBalanceMapping] = useState('0');
  const { records, loading: loadingCredits, error: errorCredits } = useRequestRecords()
  const { mapping, loading: loadingMapping, error: errorMapping } = useRequestMapping()
  
  useEffect(() => {
    if (loadingMapping || errorMapping || !mapping) return
    setBalanceMapping((Number(mapping.replace('u64', '')) / 10 ** 6).toString())
  }, [mapping])

  useEffect(() => {
    if (loadingCredits || errorCredits || records?.length === 0) return
    let balance0 = 0
    records?.forEach((r: any) => {
      if (r.spent) return
      balance0 += Number(r.data.microcredits.replace('u64.private', ''))
    })
    setBalanceRecords(String(balance0 / 10 ** 6))
  }, [records])

  console.log(records);
  
  return (
    <div className="wallet">
        <label>Balance</label>
        <span>Private: {balanceRecords} ALEO</span>
        <span>Public: {balanceMapping} ALEO</span>
        <span>Total: {Number(balanceRecords + balanceMapping)} ALEO</span>
    </div>
  );
};

export default Wallet;
