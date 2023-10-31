import { useEffect, useMemo, useState } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useRequestTransactionHistory } from "../../hooks/useRequestTransactionHistory";
import "./TransactionHistory.css";
import Table from "../Table/Table";
import { Row } from "react-table";
import { ExternalLink } from "react-external-link";
import TruncateText from "../TruncateText/TruncateText";

const TransactionHistory = () => {
  const { publicKey } = useWallet();
  const [txs, setTxs] = useState([]);
  const { txHistory, loading, error } = useRequestTransactionHistory();

  useEffect(() => {
    if (txHistory?.length > 0) {
      setTxs(txHistory.reverse());
    }
  }, [txHistory]);

  const columns = useMemo(
    () => [
      {
        Header: "Transaction ID",
        accessor: "transactionId",
      },
    ],
    []
  );

  const createRow = (row: Row) => {
    return (
      <tr {...row.getRowProps()}>
        {row.cells.map((cell) => {
          return (
            <td {...cell.getCellProps()}>
              <ExternalLink
                href={`https://explorer.aleo.org/transaction/${cell.value}`}
                className="ext-link"
              >
                <TruncateText text={cell.value} limit={36} />
              </ExternalLink>
            </td>
          );
        })}
      </tr>
    );
  };

  return (
    <div className="tx-history">
      <label className={`${!publicKey && "disable"}`}>
        Transaction History
      </label>
      <Table
        data={publicKey ? txs : []}
        createRow={createRow}
        createdColumns={columns}
        pageSize={4}
      />
      {!publicKey && <div>Connect wallet to show transactions</div>}
    </div>
  );
};

export default TransactionHistory;
