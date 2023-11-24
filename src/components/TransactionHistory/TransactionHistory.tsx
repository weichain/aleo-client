import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ExternalLink } from 'react-external-link'
import { Row } from 'react-table'

import { useAppContext } from '../../state/context'
import Table from '../Table/Table'
import TruncateText from '../TruncateText/TruncateText'
import './TransactionHistory.css'

const TransactionHistory = () => {
  const { publicKey } = useWallet()
  const { transactionHistory } = useAppContext()

  const memoized = useMemo(
    () => (publicKey ? [...transactionHistory].reverse() : []),
    [publicKey, JSON.stringify(transactionHistory)]
  )

  const columns = useMemo(
    () => [
      {
        Header: 'Transaction ID',
        accessor: 'transactionId',
      },
    ],
    []
  )

  const createRow = useCallback((row: Row) => {
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
  }, [])

  return (
    <div className="tx-history">
      <label className={`${!publicKey && 'disable'}`}>
        Transaction History
      </label>
      <Table
        data={memoized}
        createRow={createRow}
        createdColumns={columns}
        pageSize={4}
      />
      {!publicKey && <div>Connect wallet to show transactions</div>}
    </div>
  )
}

export default TransactionHistory
