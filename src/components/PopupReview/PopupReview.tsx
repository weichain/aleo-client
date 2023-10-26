import { useState, useEffect, useMemo, MouseEvent } from 'react'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import Table from '../Table/Table'
import { Row } from 'react-table'
import './PopupReview.css'
import Button from '../Button/Button'
import { useAppContext } from '../../state/context'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { handleSubmitWalletExtension } from '../CreateTransaction/handlers/extensionHandler'
import { handleMultiMethodSubmit } from '../CreateTransaction/handlers/sdkHandler'

interface PopupReviewProps {
  accounts: string[]
  amounts: string[]
  setTransactionId: (txId: string) => void
  recordToSend: any
  checkValidInputs: () => [string[], string[], Error | undefined]
  setSubmitError: (error: any) => void
  record: any
}

const PopupReview = ({
  accounts,
  amounts,
  setTransactionId,
  recordToSend,
  checkValidInputs,
  setSubmitError,
  record,
}: PopupReviewProps) => {
  const { publicKey, wallet } = useWallet()
  const [open, setOpen] = useState<boolean>()
  const [data, setData] = useState<any[]>([])
  const [totalAmount, setTotalAmount] = useState<string>()
  const closeModal = () => setOpen(false)
  const { mapping, balanceAllRecords, records } = useAppContext()!

  const calcBalance = () => {
    return Number(mapping) + Number(balanceAllRecords)
  }

  useEffect(() => {
    setOpen(accounts?.length > 0)
    let data = []
    let total = 0
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i]
      const amount = parseInt(amounts[i]) / 10 ** 6
      total += amount
      data.push({ account, amount })
    }
    setData(data)
    setTotalAmount(total.toString())
  }, [accounts, amounts])

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

  const handleSubmit = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    event.preventDefault()
    try {
      publicKey
        ? handleSubmitWalletExtension({
            publicKey,
            setTransactionId,
            wallet,
            recordToSend,
            amounts,
            recipients: accounts,
            setSubmitError,
          })
        : handleMultiMethodSubmit({ checkValidInputs, record, setSubmitError })
    } catch (e) {
      console.log('e', e)
    }
  }

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
          <span>{totalAmount} Aleo</span>
        </div>
        {publicKey && (
          <>
            <div>
              <span>Your Balance:</span>
              <span>{calcBalance()} Aleo</span>
            </div>
            <div>
              <span>Remaining:</span>
              <span>{calcBalance() - Number(totalAmount)} Aleo</span>
            </div>
          </>
        )}
      </div>
      <Button
        className="submit-btn"
        onClick={handleSubmit}
        text="Submit"
      ></Button>
    </Popup>
  )
}

export default PopupReview
