import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import Dropdown, { Option } from 'react-dropdown'
import 'react-dropdown/style.css'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { useAppContext } from '../../state/context'
import { TransferTypes } from '../../types/transferTypes'
import Button from '../Button/Button'
import PopupError from '../PopupError/PopupError'
import PopupReview from '../PopupReview/PopupReview'
import './CreateTransaction.css'

const dropDownOpts = [
  { value: TransferTypes.private, label: 'Private' },
  { value: TransferTypes.public, label: 'Public' },
  { value: TransferTypes.privateToPublic, label: 'Private To Public' },
  { value: TransferTypes.publicToPrivate, label: 'Public To Private' },
]

type WalletSendInputs = {
  recipients: string[]
  amounts: number[]
  privateKey?: string
  record?: string
}

type FormData = {
  recipients: string | string[]
  amounts: string | number[]
  privateKey?: string
  record?: string
}

const schema: z.ZodType<FormData> = z
  .object({
    recipients: z
      .string()
      .min(1, { message: 'Recepients inputs are empty' })
      .transform((arg) => arg.split('\n').map((r) => r.trim()))
      .refine(
        (arg: string[]) => {
          for (let i = 0; i < arg.length; i++) {
            const recipient = arg[i]
            if (!/^aleo1[a-z0-9]{58}$/.test(recipient)) {
              return false
            }
          }
          return true
        },
        { message: 'Invalid Aleo address' }
      ),
    amounts: z
      .string()
      .min(1, { message: 'Amounts inputs are empty' })
      .transform((arg) => arg.split('\n').map((r) => Number(r.trim())))
      .refine(
        (arg: number[]) => {
          for (let i = 0; i < arg.length; i++) {
            const amount = arg[i]
            if (isNaN(amount) || amount <= 0) return false
          }
          return true
        },
        { message: 'All amounts must be larger than 0' }
      ),
    privateKey: z.string().optional(),
    record: z.string().optional(),
  })
  .superRefine(({ recipients, amounts }, ctx) => {
    if (
      recipients.length !== amounts.length ||
      recipients.length > 15 ||
      amounts.length > 15
    ) {
      const message = 'Recepients and amounts count do not match'
      ctx.addIssue({
        code: 'custom',
        message,
        path: ['recipients'],
      })
      ctx.addIssue({
        code: 'custom',
        message,
        path: ['amounts'],
      })
    }
  })

const CreateTransaction = () => {
  const { publicKey, wallet } = useWallet()
  const [transactionId, setTransactionId] = useState<string>()
  const [submitError, setSubmitError] = useState<Error | undefined>()
  const { records, setTransferType } = useAppContext()!
  const [showPopupReview, setShowPopupReview] = useState<boolean>()
  const [walletSendInputs, setWalletSendInputs] = useState<
    WalletSendInputs | undefined
  >()
  const [status, setStatus] = useState<string>()

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
    // wallet

    setWalletSendInputs({
      recipients: _recipients,
      amounts: _amounts,
      record,
      privateKey,
    })

    setShowPopupReview(errors.root?.message ? false : true)
  }

  const onChange = (option: Option) => {
    setTransferType(option.value as TransferTypes)
  }

  return (
    <div className="component">
      <div className="dropdown-holder">
        <div className="empty"></div>
        <div className="dropdown">
          <span>Transfer Type</span>
          <Dropdown
            options={dropDownOpts}
            onChange={onChange}
            value={dropDownOpts[0]}
            placeholder="Select transfer type"
          />
        </div>
      </div>
      {!publicKey && (
        <div className="input-group">
          <label htmlFor="privateKey">Private Key</label>
          <textarea
            id="privateKey"
            // Register your input using the register function and the name of the field
            {...register('privateKey')}
            placeholder="Enter Private Key"
          />
          {errors.privateKey && <p>{errors.privateKey.message}</p>}
        </div>
      )}
      {!publicKey && (
        <div className="input-group">
          <label htmlFor="record">Record</label>
          <textarea
            id="record"
            // Register your input using the register function and the name of the field
            {...register('record')}
            placeholder="Enter Record"
          />
          {errors.record && <p>{errors.record.message}</p>}
        </div>
      )}
      <div className="input-group">
        <label htmlFor="recipients">Recipients</label>
        <textarea
          id="recipients"
          // Register your input using the register function and the name of the field
          {...register('recipients')}
          placeholder="Enter list of addresses. Each address must be on new line."
        />

        {errors.recipients && <p>{errors.recipients.message}</p>}
      </div>
      <div className="input-group">
        <label htmlFor="amounts">Amounts</label>
        <textarea
          id="amounts"
          // Register your input using the register function and the name of the field
          {...register('amounts')}
          placeholder="Enter list of amounts. Each amount must be on new line. Format in microcredits e.g. 1000000 = 1 Aleo, 100000 = 0.1 Aleo"
        />
        {errors.amounts && <p>{errors.amounts.message}</p>}
      </div>
      <Button text={'Send'} onClick={handleSubmit(onSubmit)} />
      <PopupError message={submitError} />
      {showPopupReview && (
        <PopupReview
          recipients={walletSendInputs?.recipients ?? []}
          amounts={walletSendInputs?.amounts ?? []}
          record={walletSendInputs?.record}
          setSubmitError={setSubmitError}
          setTransactionId={setTransactionId}
          privateKey={walletSendInputs?.privateKey}
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
