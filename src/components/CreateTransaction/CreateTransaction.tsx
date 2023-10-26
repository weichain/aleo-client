import { ChangeEvent, MouseEvent, useState } from 'react'
import './CreateTransaction.css'
import Button from '../Button/Button'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { useAppContext } from '../../state/context'

import PopupError from '../PopupError/PopupError'
import { handleMultiMethodSubmit } from './handlers/sdkHandler'
import {
  handleSubmitWalletExtension,
  transformInputs,
} from './handlers/extensionHandler'
import PopupReview from '../PopupReview/PopupReview'

interface WalletSendInputs {
  recordToSend: any
  recipients: string[]
  amounts: string[]
}

const CreateTransaction = () => {
  const { wallet, publicKey } = useWallet()
  const [recipients, setRecipients] = useState<string>()
  const [amounts, setAmounts] = useState<string>()
  const [privateKey, setPrivateKey] = useState<string>()
  const [record, setRecord] = useState<string>()
  const [transactionId, setTransactionId] = useState<string>()
  const [submitError, setSubmitError] = useState<Error | undefined>()
  const { records } = useAppContext()!
  const [showPopupReview, setShowPopupReview] = useState<boolean>()
  const [walletSendInputs, setWalletSendInputs] = useState<
    WalletSendInputs | undefined
  >()

  const handleRecipientsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setRecipients(e.target.value)
  }

  const handleAmountsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setAmounts(e.target.value)
  }

  const handlePrivateKeyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrivateKey(e.target.value)
  }
  const handleRecordChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setRecord(e.target.value)
  }

  const checkValidInputs = (): [string[], string[], Error | undefined] => {
    let _recipients: string[] = []
    let _amounts: string[] = []
    let error: Error | undefined
    if (!recipients || !amounts) {
      error = new Error('Recepients or amounts inputs are empty')
      return [_recipients, _amounts, error]
    }
    _recipients = recipients.split('\n').map((r) => r.trim())
    _amounts = amounts.split('\n').map((n) => n.trim())
    if (
      _recipients.length !== _amounts.length ||
      _recipients.length > 15 ||
      _amounts.length > 15
    ) {
      error = new Error('Recepients and amounts count do not match')
      return [_recipients, _amounts, error]
    }

    for (let i = 0; i < _recipients.length; i++) {
      const recipient = _recipients[i]
      const amount = parseInt(_amounts[i])
      if (!/^aleo1[a-z0-9]{58}$/.test(recipient)) {
        error = new Error(`Not valid Aleo address "${recipient}"`)
        return [_recipients, _amounts, error]
      }
      if (isNaN(amount) || amount < 0) {
        error = new Error('All amounts must be larger than 0')
        return [_recipients, _amounts, error]
      }
    }
    return [_recipients, _amounts, error]
  }

  const handleSubmit = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    event.preventDefault()
    // wallet
    const [recordToSend, recipients, amounts] = transformInputs({
      checkValidInputs,
      records,
      setSubmitError,
    })
    setWalletSendInputs({ recordToSend, recipients, amounts })
    setShowPopupReview(recipients.length > 0)

    // publicKey
    //   ? handleSubmitWalletExtension({
    //       checkValidInputs,
    //       records,
    //       publicKey,
    //       setSubmitError,
    //       setTransactionId,
    //       wallet,
    //     })
    //   : handleMultiMethodSubmit({ checkValidInputs, record, setSubmitError })
  }

  return (
    <div className="component">
      {!publicKey && (
        <div className="input-group">
          <label htmlFor="privateKey">Private Key</label>
          <textarea
            id="privateKey"
            value={privateKey}
            onChange={handlePrivateKeyChange}
            placeholder="Enter Private Key"
          />
        </div>
      )}
      {!publicKey && (
        <div className="input-group">
          <label htmlFor="record">Record</label>
          <textarea
            id="record"
            value={record}
            onChange={handleRecordChange}
            placeholder="Enter Record"
          />
        </div>
      )}
      <div className="input-group">
        <label htmlFor="recipients">Recipients</label>
        <textarea
          id="recipients"
          value={recipients}
          onChange={handleRecipientsChange}
          placeholder="Enter list of addresses. Each address must be on new line."
        />
      </div>
      <div className="input-group">
        <label htmlFor="amounts">Amounts</label>
        <textarea
          id="amounts"
          value={amounts}
          onChange={handleAmountsChange}
          placeholder="Enter list of amounts. Each amount must be on new line. Format in microcredits e.g. 1000000 = 1 Aleo, 100000 = 0.1 Aleo"
        />
      </div>
      <Button text={'Send'} onClick={handleSubmit} />
      <PopupError message={submitError} />
      {showPopupReview && (
        <PopupReview
          accounts={walletSendInputs?.recipients ?? []}
          amounts={walletSendInputs?.amounts ?? []}
          checkValidInputs={checkValidInputs}
          record={record}
          recordToSend={walletSendInputs?.recordToSend}
          setSubmitError={setSubmitError}
          setTransactionId={setTransactionId}
        />
      )}
    </div>
  )
}

export default CreateTransaction
