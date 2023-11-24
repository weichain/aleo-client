import {
  useLocalStorage,
  useWallet,
} from '@demox-labs/aleo-wallet-adapter-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Row } from 'react-table'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

import Table from '../../components/Table/Table'
import TooltipWithCopyButton from '../../components/TooltipWithCopyButton/TooltipWithCopyButton'
import TruncateText from '../../components/TruncateText/TruncateText'
import { useTransactionDetails } from '../../hooks/useTransactionDetails'
import { Account, TransactionDetails } from '../../types/transactionDetails'
import { TransactionRaw } from '../../types/transactionRaw'
import { createEmptyTransactionDetails } from '../../utils/transactionDetailsFactory'
import { getTransitionName } from '../../utils/transitionNames'
import './Transactions.css'

type IsCopied = {
  isCopied: boolean
  value: string
}

const Transactions = () => {
  useTransactionDetails()
  const { publicKey, decrypt } = useWallet()
  const [cachedTxs] = useLocalStorage<TransactionRaw[]>('transactions', [])
  const [cachedDetails, setCachedDetails] = useLocalStorage<
    TransactionDetails[]
  >('details', [])
  const [isCopied, setIsCopied] = useState<IsCopied>({
    isCopied: false,
    value: '',
  })

  const memoized = useMemo(
    () => (publicKey ? [...cachedTxs].reverse() : []),
    [publicKey, JSON.stringify(cachedTxs)]
  )

  const columns = useMemo(
    () => [
      {
        Header: 'Tx',
        accessor: 'id',
      },
      {
        Header: 'Time',
        accessor: 'timestamp',
      },
      {
        Header: 'Fee',
        accessor: 'fee',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Function',
        accessor: 'distroFunction',
      },
      {
        Header: 'Sender',
        accessor: 'senderAddress',
      },
      {
        Header: 'Sent',
        accessor: 'senderValue',
      },
      {
        Header: 'Receivers',
        accessor: 'receiverAddresses',
      },
      {
        Header: 'Received',
        accessor: 'receiverValues',
      },
    ],
    []
  )

  const parseInfo = (info: string) =>
    JSON.parse(
      info
        .replaceAll('\n', '')
        .replaceAll(' ', '')
        .replace(/(\w+):(\w+)/g, '"$1":"$2"')
    )

  const convertToTransactionDetails = useCallback(
    async ({
      metadata,
      transaction,
    }: TransactionRaw): Promise<TransactionDetails> => {
      const details = createEmptyTransactionDetails()
      details.id = transaction.id
      details.metadata.timestamp = metadata.block_timestamp
      details.metadata.status = metadata.transaction_status
      details.metadata.fee = metadata.transaction_fee
      for (let i = 0; i < transaction.execution.transitions.length; i++) {
        const transition = transaction.execution.transitions[i]
        const fn = getTransitionName(transition.function)
        if (!fn) continue
        details.distro.function = fn
        details.distro.program = transition.program
        details.sender = {
          address: publicKey ?? '',
          value: '',
        }
        const receiversObjValue = Object.values(
          parseInfo(transition.inputs[1].value)
        )
        let receivers = receiversObjValue.map((ra, i) => {
          return {
            address: ra,
            value: '',
          } as Account
        })
        details.receivers = receivers
        try {
          const receiversAmountsObj = parseInfo(
            await decrypt!(
              transition.inputs[2].value,
              transition.tpk,
              transition.program,
              fn,
              2
            )
          )
          let sentAmount = 0
          const rAmounts = Object.values(receiversAmountsObj)
          receivers = receiversObjValue.map((ra, i) => {
            const amount = (rAmounts[i] as string).replace('u64', '')
            sentAmount += parseInt(amount)
            return {
              address: ra,
              value: amount,
            } as Account
          })
          details.receivers = receivers
          details.sender.value = sentAmount.toString()
        } catch (e) {
          console.error('failed to decrypt amounts for tx - ', transaction.id)
        }
      }
      return details
    },
    [cachedTxs, publicKey]
  )

  useEffect(() => {
    if (!publicKey) return
    if (
      cachedDetails.length === 0 ||
      cachedDetails.length !== memoized.length
    ) {
      Promise.all(memoized.map((t) => convertToTransactionDetails(t))).then(
        (v: TransactionDetails[]) => {
          setCachedDetails(v)
        }
      )
    }
  }, [publicKey, memoized])

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied({ isCopied: false, value: '' })
      }, 2000)
    }
  }, [isCopied.isCopied])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied({ isCopied: true, value: text })
  }

  const createRow = useCallback(
    (row: Row) => {
      const { id, sender, receivers, metadata, distro } =
        row.original as TransactionDetails
      const timestamp = new Date(metadata.timestamp * 1000).toLocaleString()
      const fee = metadata.fee / 10 ** 6 ?? metadata.fee
      const status = metadata.status
      const distroFunction = distro.function
      const senderAddress = sender.address
      const senderValue = sender.value
        ? '' + parseInt(sender.value) / 10 ** 6
        : 'decrypt fail'

      return (
        <tr {...row.getRowProps()}>
          <td>
            <TooltipWithCopyButton id="id" value={id}>
              <TruncateText text={id} limit={24} />
            </TooltipWithCopyButton>
          </td>
          <td>
            <TooltipWithCopyButton id="timestamp" value={timestamp}>
              <TruncateText text={timestamp} limit={10} />
            </TooltipWithCopyButton>
          </td>
          <td>
            <TooltipWithCopyButton id="fee" value={fee.toString()}>
              <span>{fee}</span>
            </TooltipWithCopyButton>
          </td>
          <td>
            <TooltipWithCopyButton id="status" value={status}>
              <span>{status}</span>
            </TooltipWithCopyButton>
          </td>
          <td>
            <TooltipWithCopyButton id="distroFunction" value={distroFunction}>
              <span>{distroFunction}</span>
            </TooltipWithCopyButton>
          </td>
          <td>
            <TooltipWithCopyButton id="senderAddress" value={senderAddress}>
              <TruncateText text={senderAddress} limit={12} />
            </TooltipWithCopyButton>
          </td>
          <td>
            <TooltipWithCopyButton id="senderValue" value={senderValue}>
              <span>{senderValue}</span>
            </TooltipWithCopyButton>
          </td>
          <td>
            {receivers.map((r, i) => (
              <TooltipWithCopyButton
                id={'receiverAddress' + i}
                value={r.address}
              >
                <>
                  <TruncateText text={r.address} limit={12} />
                  <br />
                </>
              </TooltipWithCopyButton>
            ))}
          </td>
          <td>
            {receivers.map((r, i) => (
              <TooltipWithCopyButton id={'receiverValue' + i} value={r.value}>
                <>
                  <span>
                    {r.value ? parseInt(r.value) / 10 ** 6 : 'decrypt fail'}
                  </span>
                  <br />
                </>
              </TooltipWithCopyButton>
            ))}
          </td>
        </tr>
      )
    },
    [publicKey, memoized, isCopied.isCopied]
  )

  return (
    <div className="tx-table">
      <label className={`${!publicKey && 'disable'}`}>
        Transaction Details
      </label>
      <Table
        data={publicKey ? cachedDetails : []}
        createRow={createRow}
        createdColumns={columns}
        pageSize={10}
      />
      {!publicKey && <div>Connect wallet to show transactions</div>}
    </div>
  )
}

export default Transactions
