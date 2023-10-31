import React, { useEffect, useState } from "react";
import { useRequestRecords } from "../../hooks/useRequestRecords";
import "./Wallet.css";
import { useRequestMapping } from "../../hooks/useRequestMapping";
import { useRequestTransactionHistory } from "../../hooks/useRequestTransactionHistory";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useAppContext } from "../../state/context";

const Wallet = () => {
  const { publicKey } = useWallet();
  const { records } = useRequestRecords();
  const { mapping } = useRequestMapping();
  const {
    balanceAllRecords,
    mapping: mappingBalance,
    setBalanceAllRecords,
    setMapping,
  } = useAppContext()!;

  useEffect(() => {
    let temp;
    if (mapping) {
      temp = (Number(mapping.replace("u64", "")) / 10 ** 6).toString();
      setMapping(temp);
    }
    if (records?.length > 0) {
      let balance0 = 0;
      records?.forEach((r: any) => {
        if (r.spent) return;
        balance0 += Number(r.data.microcredits.replace("u64.private", ""));
      });
      temp = String(balance0 / 10 ** 6);
      setBalanceAllRecords(temp);
    }
  }, [mapping, records]);

  useEffect(() => {
    if (publicKey) return;
    setMapping("0");
    setBalanceAllRecords("0");
  }, [publicKey]);

  return (
    <div className="wallet">
      <div className={`balances ${!publicKey && "disable"}`}>
        <label>Balance</label>
        <span>Private: {balanceAllRecords} ALEO</span>
        <span>Public: {mappingBalance} ALEO</span>
        <span>
          Total:{" "}
          {(
            parseFloat(balanceAllRecords) + parseFloat(mappingBalance)
          ).toPrecision(6)}{" "}
          ALEO
        </span>
      </div>
      {!publicKey && <div>Connect wallet to show balance</div>}
    </div>
  );
};

export default Wallet;
