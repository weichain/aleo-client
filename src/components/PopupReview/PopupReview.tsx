import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { MouseEvent, useEffect, useMemo, useState } from 'react'
import { Row } from 'react-table'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'

import { useAppContext } from '../../state/context'
import { handleMultiMethodSubmit } from '../CreateTransaction/handlers/sdkHandler'
import Table from '../Table/Table'
import { TransferHandlerWalletExtension } from '../TransferHandlerWalletExtension/TransferHandlerWalletExtension'
import './PopupReview.css'

type PopupReviewProps = {
  setTransactionId: (txId: string) => void
  setSubmitError: (error: any) => void
}

const PopupReview = ({
  setTransactionId,
  setSubmitError,
}: PopupReviewProps) => {
  const { publicKey } = useWallet()
  const [open, setOpen] = useState<boolean>()
  const [data, setData] = useState<any[]>([])
  const [totalAmount, setTotalAmount] = useState<string>()
  const closeModal = () => setOpen(false)
  const { accountInfo, transactionInfo } = useAppContext()
  const { mapping, balanceRecords } = accountInfo
  const {
    transactionInputs: { amounts, recipients, record, privateKey },
  } = transactionInfo

  const calcBalance = () => {
    return (Number(mapping) + Number(balanceRecords)).toFixed(6)
  }

  useEffect(() => {
    setOpen(recipients.length > 0)
    let data = []
    let total = 0
    for (let i = 0; i < recipients.length; i++) {
      const account = recipients[i]
      const amount = amounts[i] / 10 ** 6
      total += amount
      data.push({ account, amount })
    }
    setData(data)
    setTotalAmount(total.toFixed(6))
  }, [recipients, amounts])

  const columns = useMemo(
    () => [
      {
        Header: 'Address',
        accessor: 'account',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
    ],
    []
  )

  const createRow = (row: Row) => {
    return (
      <tr {...row.getRowProps()}>
        {row.cells.map((cell) => {
          return (
            <td style={{ paddingRight: '1em' }} {...cell.getCellProps()}>
              {cell.value}
            </td>
          )
        })}
      </tr>
    )
  }

  // const handleSubmit = (
  //   event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  // ) => {
  //   event.preventDefault()
  //   try {
  //     publicKey
  //       ? handleSubmitWalletExtension({
  //           publicKey,
  //           setTransactionId,
  //           wallet,
  //           recordToSend,
  //           amounts,
  //           recipients: accounts,
  //           setSubmitError,
  //         })
  //       : handleMultiMethodSubmit({
  //           record,
  //           setSubmitError,
  //           privateKey,
  //           setTransactionId,
  //           recipients: accounts,
  //           amounts,
  //           // aleoWorker
  //         })
  //     closeModal()
  //   } catch (e) {
  //     console.log('e', e)
  //   }
  // }

  return (
    <Popup className="custom-popup" open={open} onClose={closeModal}>
      <div className="modal">
        <a className="close" onClick={closeModal}>
          &times;
        </a>
        <label className="label">Review</label>
        <Table
          data={data}
          createRow={createRow}
          createdColumns={columns}
          pageSize={5}
        />
      </div>
      <div className="nfo">
        <div>
          <span>Total:</span>
          <span>{parseFloat(totalAmount ?? '0')} Aleo</span>
        </div>
        {publicKey && (
          <>
            <div>
              <span>Your Balance:</span>
              <span>{parseFloat(calcBalance())} Aleo</span>
            </div>
            <div>
              <span>Remaining:</span>
              <span>
                {(
                  parseFloat(calcBalance()) - parseFloat(totalAmount ?? '0')
                ).toFixed(6)}{' '}
                Aleo
              </span>
            </div>
          </>
        )}
      </div>
      <TransferHandlerWalletExtension
        setSubmitError={setSubmitError}
        setTransactionId={setTransactionId}
      />
    </Popup>
  )
}

export default PopupReview
