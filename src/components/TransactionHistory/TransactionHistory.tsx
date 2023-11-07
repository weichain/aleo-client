import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { useEffect, useMemo, useState } from 'react'
import { ExternalLink } from 'react-external-link'
import { Row } from 'react-table'

import { useRequestTransactionHistory } from '../../hooks/useRequestTransactionHistory'
import Table from '../Table/Table'
import TruncateText from '../TruncateText/TruncateText'
import './TransactionHistory.css'

const TransactionHistory = () => {
  const { publicKey } = useWallet()
  const [txs, setTxs] = useState([])
  const { txHistory, loading, error } = useRequestTransactionHistory()

  useEffect(() => {
    if (txHistory?.length > 0 && txHistory?.length !== txs.length) {
      setTxs(txHistory.reverse())
    }
  }, [txHistory])

  const columns = useMemo(
    () => [
      {
        Header: 'Transaction ID',
        accessor: 'transactionId',
      },
    ],
    []
  )

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
          )
        })}
      </tr>
    )
  }

  return (
    <div className="tx-history">
      <label className={`${!publicKey && 'disable'}`}>
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
  )
}

export default TransactionHistory
