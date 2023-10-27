import * as aleo from "@aleohq/sdk";

import { ChangeEvent, MouseEvent, useState } from 'react'
import './CreateTransaction.css'
import Button from '../Button/Button'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { useAppContext } from '../../state/context'

import PopupError from '../PopupError/PopupError'
import { createAddressesInput, createAmountsInput } from '../../utils/programInput';
import { handleMultiMethodSubmit } from './handlers/sdkHandler'
import {
  handleSubmitWalletExtension,
  transformInputs,
} from './handlers/extensionHandler'
import PopupReview from '../PopupReview/PopupReview'

import { retry } from '../../utils/retry';
import { getNumberPerTransition, getTransitionsNames } from "../../utils/transitionNames";

interface WalletSendInputs {
  recordToSend: any
  recipients: string[]
  amounts: string[]
}

const CreateTransaction = () => {
  const { wallet, publicKey, connected } = useWallet()
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

  const handleMultiMethodSubmit = async (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    const [_recipients, _amounts, error] = checkValidInputs()
    const programName = "multi_transfer_aleo.aleo";
    const transitions = getTransitionsNames(_recipients.length);

    const defaultHost = "https://api.explorer.aleo.org/v1";
    const keyProvider = new aleo.AleoKeyProvider();
    const programManager = new aleo.ProgramManager(defaultHost, keyProvider, undefined);
    
    keyProvider.useCache(true);
    programManager.setHost(defaultHost);

    const privateKeyObject = aleo.PrivateKey.from_string(privateKey as string);
    
    // automatic calc of fee left as comment since execution speeds are very slow; waiting for improvements
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
    const cacheKey = `${programName}:${transitions[0]}`;
    const keyParams = new aleo.AleoKeyProviderParams({"cacheKey": cacheKey})

    const numberPerTransition = getNumberPerTransition(_recipients.length)
    const inputAddresses = JSON.stringify(createAddressesInput(_recipients.slice(0, numberPerTransition[0]))).replaceAll('"','');
    const inputAmounts = JSON.stringify(createAmountsInput(_amounts.slice(0, numberPerTransition[0]))).replaceAll('"','');

    const transaction_id = await programManager.execute(
      programName,
      transitions[0],
      0.5,
      false,
      [record as string, inputAddresses, inputAmounts],
      undefined,
      keyParams,
      undefined,
      undefined,
      undefined,
      privateKeyObject
    );
    const transaction = await retry(() => programManager.networkClient.getTransaction(transaction_id.toString()))
    let recordFromFirstTransaction;
    if (transaction && 'execution' in transaction && transaction.execution && transaction.execution.transitions && transaction.execution.transitions[0] && transaction.execution.transitions[0].outputs) {
      recordFromFirstTransaction = transaction.execution.transitions[0].outputs[1];
    }
    if (transitions[1]){
      const recordCiphertext = aleo.RecordCiphertext.fromString(recordFromFirstTransaction?.value as string);
      const recordPlaintext = recordCiphertext.decrypt(privateKeyObject.to_view_key());

      const secondInputAddresses = JSON.stringify(createAddressesInput(_recipients.slice(numberPerTransition[0]))).replaceAll('"','');
      const secondInputAmounts = JSON.stringify(createAmountsInput(_amounts.slice(numberPerTransition[0]))).replaceAll('"','');

      const secondTransactionId = await programManager.execute(
        programName,
        transitions[1],
        0.5,
        false,
        [recordPlaintext.toString(), secondInputAddresses, secondInputAmounts],
        undefined,
        keyParams,
        undefined,
        undefined,
        undefined,
        privateKeyObject
      );
      console.log(secondTransactionId)
    }
  }

  const handleSingleMethodSubmit = async (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    const [_recipients, _amounts, error] = checkValidInputs();

    const programName = "distrofund_single_transition.aleo";
    const functionName = "main";

    const defaultHost = "https://api.explorer.aleo.org/v1";
    const keyProvider = new aleo.AleoKeyProvider();
    const programManager = new aleo.ProgramManager(defaultHost, keyProvider, undefined);
    
    keyProvider.useCache(true);
    const privateKeyObject = aleo.PrivateKey.from_string(privateKey as string);
  
    const cacheKey = `${programName}:${functionName}`;

    const keyParams = new aleo.AleoKeyProviderParams({"cacheKey": cacheKey})
    programManager.setHost(defaultHost);
    const inputs = [
      record, 
      JSON.stringify(createAddressesInput(_recipients)).replaceAll('"',''), 
      JSON.stringify(createAmountsInput(_amounts)).replaceAll('"','')
    ] as string[];

    console.log('inputs: ', inputs)

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
    );
    const transaction = await programManager.networkClient.getTransaction(transaction_id as string);
  };

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
      <Button text={'Send'} onClick={connected ? handleSubmit : handleMultiMethodSubmit} />
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
