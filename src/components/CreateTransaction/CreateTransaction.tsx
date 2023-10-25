import { ChangeEvent, MouseEvent, useState } from 'react'
import './CreateTransaction.css'
import Button from '../Button/Button'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import {
  Transaction,
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from '@demox-labs/aleo-wallet-adapter-base'
import { useRecordsContext } from '../../state/context'
import { AddressesInput } from '../../types/program'
import {
  createAddressesInput,
  createAmountsInput,
} from '../../utils/programInput'
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo'
import * as aleo from '@aleohq/sdk'
import {
  getNumberPerTransition,
  getTransitionsNames,
} from '../../utils/transitionNames'
import ControlledPopup from '../ControllerPopup/ControlledPopup'

const CreateTransaction = () => {
  const { wallet, publicKey, requestTransaction } = useWallet()
  const [recipients, setRecipients] = useState<string>()
  const [amounts, setAmounts] = useState<string>()
  const [privateKey, setPrivateKey] = useState<string>()
  const [record, setRecord] = useState<string>()
  const [transactionId, setTransactionId] = useState<string>()
  const [submitError, setSubmitError] = useState<Error | undefined>()
  const { records } = useRecordsContext()!

  let shouldPop = submitError?.message ? true : false

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
    _recipients = recipients.split(',').map((r) => r.trim())
    _amounts = amounts.split(',').map((n) => n.trim())
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
      const amount = parseInt(amounts[i])
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

  const handleSubmit = async (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    event.preventDefault()
    publicKey ? handleSubmitWalletExtension() : handleMultiMethodSubmit()
  }

  const handleSubmitWalletExtension = async () => {
    if (!publicKey) {
      return setSubmitError(new WalletNotConnectedError())
    }
    const [_recipients, _amounts, error] = checkValidInputs()
    if (error) {
      return setSubmitError(error)
    }
    const fullSendAmount = _amounts
      .map((e) => parseInt(e))
      .reduce((acc, cur) => acc + cur)
    const amountRecords = records.map((r) =>
      parseInt(r.data.microcredits.replace('u64.private', ''))
    )
    console.log(_recipients, _amounts, fullSendAmount, amountRecords)
    // let recordToSend = `{"id":"0cffac49-db2b-5c4c-96e0-20b17479db09","owner":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","program_id":"credits.aleo","spent":false,"recordName":"credits","data":{"microcredits":"4896500u64.private"}}`
    let recordToSend
    for (let i = 0; i < records.length; i++) {
      const amountRec = amountRecords[i]
      if (amountRec < fullSendAmount) continue
      recordToSend = records[i]
    }
    if (!recordToSend) {
      setSubmitError(new Error('cannot find record with enought amount'))
      return
    }
    // console.log(JSON.stringify(createAmountsInput(_amounts)));
    // const one = `{"address1":"aleo1glx6qauqmjejkj9v79rcl46vu089rcen759dznjn69jhhwkx25gqa03hnz","address2":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address3":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address4":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address5":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address6":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address7":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address8":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address9":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address10":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address11":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address12":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address13":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address14":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address15":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9"}`.replaceAll('"','')
    // const two = `{"amount1":"1000000u64","amount2":"0u64","amount3":"0u64","amount4":"0u64","amount5":"0u64","amount6":"0u64","amount7":"0u64","amount8":"0u64","amount9":"0u64","amount10":"0u64","amount11":"0u64","amount12":"0u64","amount13":"0u64","amount14":"0u64","amount15":"0u64"}`.replaceAll('"','')

    const inputs = [
      recordToSend,
      JSON.stringify(createAddressesInput(_recipients)).replaceAll('"', ''),
      JSON.stringify(createAmountsInput(_amounts)).replaceAll('"', ''),
    ]

    const aleoTransaction = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.Testnet,
      'disperse_all_fifteen.aleo',
      // 'disperse_milion_test.aleo',
      'main',
      inputs,
      500000
    )

    const txId =
      (await (wallet?.adapter as LeoWalletAdapter).requestTransaction(
        aleoTransaction
      )) || ''
    // if (event.target?.value) {
    //   event.target.elements[0].value = '';
    // }
    setTransactionId(txId)
    console.log('txId', txId)
  }

  // untested
  const handleMultiMethodSubmit = async () => {
    const [_recipients, _amounts, error] = checkValidInputs()
    if (error) {
      return setSubmitError(error)
    }
    const programName = 'multi_transfer_aleo.aleo'
    const transitions = getTransitionsNames(_recipients.length)

    const defaultHost = 'https://api.explorer.aleo.org/v1'
    const keyProvider = new aleo.AleoKeyProvider()
    const programManager = new aleo.ProgramManager(
      defaultHost,
      keyProvider,
      undefined
    )

    keyProvider.useCache(true)
    programManager.setHost(defaultHost)

    const privateKeyObject = aleo.PrivateKey.from_string(
      'APrivateKey1zkp2J6XPd4EgLbSkEHccUGaqgTGjbgEgVdnDdvk6L7CdG81' as string
    )

    // automatic calc of fee
    // const executeFee = await programManager.executionEngine.estimateExecutionFee(
    //   privateKeyObject,
    //   "import credits.aleo;\n\nprogram disperse_multi_method.aleo;\n\nstruct Addresses1:\n    address1 as address;\n\nstruct Addresses2:\n    address1 as address;\n    address2 as address;\n\nstruct Addresses3:\n    address1 as address;\n    address2 as address;\n    address3 as address;\n\nstruct Addresses4:\n    address1 as address;\n    address2 as address;\n    address3 as address;\n    address4 as address;\n\nstruct Addresses5:\n    address1 as address;\n    address2 as address;\n    address3 as address;\n    address4 as address;\n    address5 as address;\n\nstruct Addresses10:\n    address1 as address;\n    address2 as address;\n    address3 as address;\n    address4 as address;\n    address5 as address;\n    address6 as address;\n    address7 as address;\n    address8 as address;\n    address9 as address;\n    address10 as address;\n\nstruct Amount1:\n    amount1 as u64;\n\nstruct Amount2:\n    amount1 as u64;\n    amount2 as u64;\n\nstruct Amount3:\n    amount1 as u64;\n    amount2 as u64;\n    amount3 as u64;\n\nstruct Amount4:\n    amount1 as u64;\n    amount2 as u64;\n    amount3 as u64;\n    amount4 as u64;\n\nstruct Amount5:\n    amount1 as u64;\n    amount2 as u64;\n    amount3 as u64;\n    amount4 as u64;\n    amount5 as u64;\n\nstruct Amount10:\n    amount1 as u64;\n    amount2 as u64;\n    amount3 as u64;\n    amount4 as u64;\n    amount5 as u64;\n    amount6 as u64;\n    amount7 as u64;\n    amount8 as u64;\n    amount9 as u64;\n    amount10 as u64;\n\nfunction transfer_one:\n    input r0 as credits.aleo/credits.record;\n    input r1 as Addresses1.public;\n    input r2 as Amount1.private;\n    call credits.aleo/transfer_private r0 r1.address1 r2.amount1 into r3 r4;\n    output r4 as credits.aleo/credits.record;\n    output r3 as credits.aleo/credits.record;\n\nfunction transfer_two:\n    input r0 as credits.aleo/credits.record;\n    input r1 as Addresses2.public;\n    input r2 as Amount2.private;\n    call credits.aleo/transfer_private r0 r1.address1 r2.amount1 into r3 r4;\n    call credits.aleo/transfer_private r4 r1.address2 r2.amount2 into r5 r6;\n    output r6 as credits.aleo/credits.record;\n    output r3 as credits.aleo/credits.record;\n    output r5 as credits.aleo/credits.record;\n\nfunction transfer_three:\n    input r0 as credits.aleo/credits.record;\n    input r1 as Addresses3.public;\n    input r2 as Amount3.private;\n    call credits.aleo/transfer_private r0 r1.address1 r2.amount1 into r3 r4;\n    call credits.aleo/transfer_private r4 r1.address2 r2.amount2 into r5 r6;\n    call credits.aleo/transfer_private r6 r1.address3 r2.amount3 into r7 r8;\n    output r8 as credits.aleo/credits.record;\n    output r3 as credits.aleo/credits.record;\n    output r5 as credits.aleo/credits.record;\n    output r7 as credits.aleo/credits.record;\n\nfunction transfer_four:\n    input r0 as credits.aleo/credits.record;\n    input r1 as Addresses4.public;\n    input r2 as Amount4.private;\n    call credits.aleo/transfer_private r0 r1.address1 r2.amount1 into r3 r4;\n    call credits.aleo/transfer_private r4 r1.address2 r2.amount2 into r5 r6;\n    call credits.aleo/transfer_private r6 r1.address3 r2.amount3 into r7 r8;\n    call credits.aleo/transfer_private r8 r1.address4 r2.amount4 into r9 r10;\n    output r10 as credits.aleo/credits.record;\n    output r3 as credits.aleo/credits.record;\n    output r5 as credits.aleo/credits.record;\n    output r7 as credits.aleo/credits.record;\n    output r9 as credits.aleo/credits.record;\n\nfunction transfer_five:\n    input r0 as credits.aleo/credits.record;\n    input r1 as Addresses5.public;\n    input r2 as Amount5.private;\n    call credits.aleo/transfer_private r0 r1.address1 r2.amount1 into r3 r4;\n    call credits.aleo/transfer_private r4 r1.address2 r2.amount2 into r5 r6;\n    call credits.aleo/transfer_private r6 r1.address3 r2.amount3 into r7 r8;\n    call credits.aleo/transfer_private r8 r1.address4 r2.amount4 into r9 r10;\n    call credits.aleo/transfer_private r10 r1.address5 r2.amount5 into r11 r12;\n    output r12 as credits.aleo/credits.record;\n    output r3 as credits.aleo/credits.record;\n    output r5 as credits.aleo/credits.record;\n    output r7 as credits.aleo/credits.record;\n    output r9 as credits.aleo/credits.record;\n    output r11 as credits.aleo/credits.record;\n\nfunction transfer_ten:\n    input r0 as credits.aleo/credits.record;\n    input r1 as Addresses10.public;\n    input r2 as Amount10.private;\n    call credits.aleo/transfer_private r0 r1.address1 r2.amount1 into r3 r4;\n    call credits.aleo/transfer_private r4 r1.address2 r2.amount2 into r5 r6;\n    call credits.aleo/transfer_private r6 r1.address3 r2.amount3 into r7 r8;\n    call credits.aleo/transfer_private r8 r1.address4 r2.amount4 into r9 r10;\n    call credits.aleo/transfer_private r10 r1.address5 r2.amount5 into r11 r12;\n    call credits.aleo/transfer_private r12 r1.address6 r2.amount6 into r13 r14;\n    call credits.aleo/transfer_private r14 r1.address7 r2.amount7 into r15 r16;\n    call credits.aleo/transfer_private r16 r1.address8 r2.amount8 into r17 r18;\n    call credits.aleo/transfer_private r18 r1.address9 r2.amount9 into r19 r20;\n    call credits.aleo/transfer_private r20 r1.address10 r2.amount10 into r21 r22;\n    output r22 as credits.aleo/credits.record;\n    output r3 as credits.aleo/credits.record;\n    output r5 as credits.aleo/credits.record;\n    output r7 as credits.aleo/credits.record;\n    output r9 as credits.aleo/credits.record;\n    output r11 as credits.aleo/credits.record;\n    output r13 as credits.aleo/credits.record;\n    output r15 as credits.aleo/credits.record;\n    output r17 as credits.aleo/credits.record;\n    output r19 as credits.aleo/credits.record;\n    output r21 as credits.aleo/credits.record;\n",
    //   functionName,
    //   ["{owner:aleo17afmtt55wu85zt4nnlsx6armxf2rt46kz88dxvdr9m4ppzdyuuqsrxrphf.private,microcredits:39999993u64.private,_nonce:7642003947641652702808599505047689609949750663154791663216571290532980280913group.public}", "{address1: aleo1pz3qc5cej3alxqewalelzzjlgxedq83w2w35rnwkempmqu6dvvrsajsk5d}", "{amount1: 2u64}"],
    //   defaultHost,
    //   true,
    //   undefined,
    //   undefined,
    //   undefined
    // )
    // console.log('fee: ', Number(executeFee))
    const cacheKey = `${programName}:${transitions[0]}`
    const keyParams = new aleo.AleoKeyProviderParams({ cacheKey: cacheKey })

    const numberPerTransition = getNumberPerTransition(_recipients.length)
    const inputAddresses = JSON.stringify(
      createAddressesInput(_recipients.slice(0, numberPerTransition[0]))
    ).replaceAll('"', '')
    const inputAmounts = JSON.stringify(
      createAmountsInput(_amounts.slice(0, numberPerTransition[0]))
    ).replaceAll('"', '')

    const transaction_id = await programManager.execute(
      programName,
      transitions[0],
      1,
      false,
      [record as string, inputAddresses, inputAmounts],
      undefined,
      keyParams,
      undefined,
      undefined,
      undefined,
      privateKeyObject
    )
    console.log(transaction_id)
    // const transaction = await programManager.networkClient.getTransaction(transaction_id as string);
    if (transitions[1]) {
      const secondInputAddresses = JSON.stringify(
        createAddressesInput(_recipients.slice(numberPerTransition[0] + 1))
      ).replaceAll('"', '')
      const secondInputAmounts = JSON.stringify(
        createAmountsInput(_amounts.slice(numberPerTransition[0] + 1))
      ).replaceAll('"', '')
      const second_transaction_id = await programManager.execute(
        programName,
        transitions[1],
        0.5,
        false,
        [record as string, secondInputAddresses, secondInputAmounts],
        undefined,
        keyParams,
        undefined,
        undefined,
        undefined,
        privateKeyObject
      )
      console.log(second_transaction_id)
      // extract the resulting record from the above transaction object
      // repeat program execution but with the second transition
    }
  }

  const handleSingleMethodSubmit = async (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    const [_recipients, _amounts, error] = checkValidInputs()

    const programName = 'single_transfer_aleo.aleo'
    const functionName = 'main'

    const defaultHost = 'https://api.explorer.aleo.org/v1'
    const keyProvider = new aleo.AleoKeyProvider()
    const programManager = new aleo.ProgramManager(
      defaultHost,
      keyProvider,
      undefined
    )

    keyProvider.useCache(true)
    const privateKeyObject = aleo.PrivateKey.from_string(privateKey as string)

    const cacheKey = `${programName}:${functionName}`

    const keyParams = new aleo.AleoKeyProviderParams({ cacheKey: cacheKey })
    programManager.setHost(defaultHost)
    const inputs = [
      record,
      JSON.stringify(createAddressesInput(_recipients)).replaceAll('"', ''),
      JSON.stringify(createAmountsInput(_amounts)).replaceAll('"', ''),
    ] as string[]

    const transaction_id = await programManager.execute(
      programName,
      functionName,
      0.5,
      false,
      inputs,
      undefined,
      keyParams,
      undefined,
      undefined,
      undefined,
      privateKeyObject
    )
    const transaction = await programManager.networkClient.getTransaction(
      transaction_id as string
    )
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
          placeholder="Enter list of addresses"
        />
      </div>
      <div className="input-group">
        <label htmlFor="amounts">Amounts</label>
        <textarea
          id="amounts"
          value={amounts}
          onChange={handleAmountsChange}
          placeholder="Enter list of amounts"
        />
      </div>
      <Button text={'Send'} onClick={handleSubmit} />
      <ControlledPopup message={submitError} />
    </div>
  )
}

export default CreateTransaction
