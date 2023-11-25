import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import 'react-dropdown/style.css'
import { useForm } from 'react-hook-form'

import { useAppContext } from '../../state/context'
import Button from '../Button/Button'
import Checkbox from '../Checkbox/Checkbox'
import DropdownHolder from '../DropdownHolder/DropdownHolder'
import InputGroup from '../InputGroup/InputGroup'
import PopupError from '../PopupError/PopupError'
import PopupReview from '../PopupReview/PopupReview'
import './CreateTransaction.css'
import { schema } from './zod.schema'

export type FormData = {
  recipients: string | string[]
  amounts: string | number[]
  privateKey?: string
  record?: string
}

const CreateTransaction = () => {
  const { publicKey, wallet } = useWallet()
  const [transactionId, setTransactionId] = useState<string>()
  const [submitError, setSubmitError] = useState<Error | undefined>()
  const [showPopupReview, setShowPopupReview] = useState<boolean>()
  const [status, setStatus] = useState<string>()
  const { transactionInfo, setTransactionInfo } = useAppContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined
    if (!publicKey) return
    if (transactionId) {
      intervalId = setInterval(() => {
        getTransactionStatus(transactionId!)
      }, 1000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [transactionId])

  const getTransactionStatus = async (txId: string) => {
    const status = await (
      wallet?.adapter as LeoWalletAdapter
    ).transactionStatus(txId)
    setStatus(status)
  }

  const onSubmit = ({ recipients, amounts, record, privateKey }: FormData) => {
    const _recipients = recipients as string[]
    const _amounts = amounts as number[]

    setTransactionInfo({
      ...transactionInfo,
      transactionInputs: {
        recipients: _recipients,
        amounts: _amounts,
        record,
        privateKey,
      },
    })

    setShowPopupReview(errors.root?.message ? false : true)
  }

  const handleChecked = (checked: boolean) => {
    console.log(checked)
  }

  return (
    <div className="component">
      <DropdownHolder />
      {!publicKey && (
        <InputGroup
          id="privateKey"
          label="Private Key"
          placeholder="Enter Private Key"
          errors={errors}
          register={register}
        />
      )}
      {!publicKey && (
        <InputGroup
          id="record"
          label="Record"
          placeholder="Enter Record"
          errors={errors}
          register={register}
        />
      )}
      <InputGroup
        id="recipients"
        label="Recipients"
        placeholder="Enter list of addresses. Each address must be on new line."
        errors={errors}
        register={register}
      />
      <InputGroup
        id="amounts"
        label="Amounts"
        placeholder="Enter list of amounts. Each amount must be on new line. Format in microcredits e.g. 1000000 = 1 Aleo, 100000 = 0.1 Aleo"
        errors={errors}
        register={register}
      />
      <div className="checkboxes">
        <Checkbox
          labels={['Tokens', 'Credits']}
          handleChecked={handleChecked}
        />
        <Checkbox
          labels={['Public Fee', 'Private Fee']}
          handleChecked={handleChecked}
        />
      </div>
      <Button text={'Send'} onClick={handleSubmit(onSubmit)} />
      <PopupError message={submitError} />
      {showPopupReview && (
        <PopupReview
          setSubmitError={setSubmitError}
          setTransactionId={setTransactionId}
        />
      )}
      {transactionId && (
        <>
          Wallet transaction ID- <span>{transactionId}</span>
          {status && (
            <>
              Status - <span>{status}</span>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default CreateTransaction
