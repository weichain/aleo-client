import {
  Transaction,
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from "@demox-labs/aleo-wallet-adapter-base";
import {
  createAddressesInput,
  createAmountsInput,
} from "../../../utils/programInput";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import { Wallet } from "@demox-labs/aleo-wallet-adapter-react";

interface ValidateInputsParams {
  checkValidInputs: () => [string[], string[], Error | undefined];
  setSubmitError: (error: any) => void;
  records: any[];
}

export const transformInputs = ({
  checkValidInputs,
  setSubmitError,
  records,
}: ValidateInputsParams): [any | void, string[], string[]] => {
  const [_recipients, _amounts, error] = checkValidInputs();
  if (error) {
    return [setSubmitError(error), [], []];
  }
  const fullSendAmount = _amounts
    .map((e: any) => parseInt(e))
    .reduce((acc: any, cur: any) => acc + cur);
  const amountRecords = records.map((r) =>
    parseInt(r.data.microcredits.replace("u64.private", ""))
  );
  console.log(_recipients, _amounts, fullSendAmount, amountRecords);
  // let recordToSend = `{"id":"0cffac49-db2b-5c4c-96e0-20b17479db09","owner":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","program_id":"credits.aleo","spent":false,"recordName":"credits","data":{"microcredits":"4896500u64.private"}}`
  let recordToSend;
  for (let i = 0; i < records.length; i++) {
    const amountRec = amountRecords[i];
    if (amountRec < fullSendAmount) continue;
    recordToSend = records[i];
  }
  //   if (!recordToSend) {
  // return [
  //   setSubmitError(new Error('cannot find record with enought amount')),
  //   [],
  //   [],
  // ]
  //   }
  return [recordToSend, _recipients, _amounts];
};

interface HandleSubmitWalletExtensionParams {
  publicKey: string;
  wallet: Wallet | null;
  setTransactionId: (txId: string) => void;
  recordToSend: any;
  recipients: string[];
  amounts: string[];
  setSubmitError: (error: any) => void;
}

export const handleSubmitWalletExtension = async ({
  publicKey,
  wallet,
  setTransactionId,
  recordToSend,
  recipients,
  amounts,
  setSubmitError,
}: HandleSubmitWalletExtensionParams) => {
  // console.log(JSON.stringify(createAmountsInput(_amounts)));
  // const one = `{"address1":"aleo1glx6qauqmjejkj9v79rcl46vu089rcen759dznjn69jhhwkx25gqa03hnz","address2":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address3":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address4":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address5":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address6":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address7":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address8":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address9":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address10":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address11":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address12":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address13":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address14":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address15":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9"}`.replaceAll('"','')
  // const two = `{"amount1":"1000000u64","amount2":"0u64","amount3":"0u64","amount4":"0u64","amount5":"0u64","amount6":"0u64","amount7":"0u64","amount8":"0u64","amount9":"0u64","amount10":"0u64","amount11":"0u64","amount12":"0u64","amount13":"0u64","amount14":"0u64","amount15":"0u64"}`.replaceAll('"','')

  const inputs = [
    recordToSend,
    JSON.stringify(createAddressesInput(recipients)).replaceAll('"', ""),
    JSON.stringify(createAmountsInput(amounts)).replaceAll('"', ""),
  ];
  console.log("inputs", inputs);

  const aleoTransaction = Transaction.createTransaction(
    publicKey,
    WalletAdapterNetwork.Testnet,
    "distrofund_private_transfer.aleo",
    // 'disperse_milion_test.aleo',
    "main",
    inputs,
    500000
  );

  try {
    const txId =
      (await (wallet?.adapter as LeoWalletAdapter).requestTransaction(
        aleoTransaction
      )) || "";
    // if (event.target?.value) {
    //   event.target.elements[0].value = '';
    // }
    setTransactionId(txId);
    console.log("txId", txId);
  } catch (e) {
    setSubmitError(e);
  }
};
