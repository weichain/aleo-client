import {
  Account,
  ProgramManager,
  PrivateKey,
  initThreadPool,
  AleoKeyProvider,
  AleoNetworkClient,
  NetworkRecordProvider,
  AleoKeyProviderParams
} from "@aleohq/sdk";
import { expose, proxy } from "comlink";

await initThreadPool();

async function localProgramExecution(program, aleoFunction, inputs) {
  const programManager = new ProgramManager();

  // Create a temporary account for the execution of the program
  const account = new Account();
  programManager.setAccount(account);

  const executionResponse = await programManager.executeOffline(
    program,
    aleoFunction,
    inputs,
    false,
  );
  return executionResponse.getOutputs();
}

async function getPrivateKey() {
  const key = new PrivateKey();
  return proxy(key);
}
//APrivateKey1zkp2J6XPd4EgLbSkEHccUGaqgTGjbgEgVdnDdvk6L7CdG81

// {
//   owner: aleo1nc00lw3fhakut05eckc956t7g276jl9yuye9fzjq6sk9vk8zugpqsy9mjn.private,
//   microcredits: 6999908u64.private,
//   _nonce: 1766705656080377125087886630987755943868573690646352568298051128435265753546group.public
// }

//aleo1nc00lw3fhakut05eckc956t7g276jl9yuye9fzjq6sk9vk8zugpqsy9mjn
async function executeProgram(privateKey, transition, record, inputAddresses, inputAmounts){
  const programName = 'distrofund_private_transfer.aleo'

  const defaultHost = 'https://api.explorer.aleo.org/v1'
  // console.log('priv key: ', privateKey.to_string())
  const privateKeyObject = PrivateKey.from_string(privateKey)
  const keyProvider = new AleoKeyProvider()
  const programManager = new ProgramManager(
    defaultHost,
    keyProvider,
    undefined
  )

  keyProvider.useCache(true)
  programManager.setHost(defaultHost)

  const cacheKey = `${programName}:${transition}`
  const keyParams = new AleoKeyProviderParams({ cacheKey: cacheKey })

  const transaction_id = await programManager.execute(
    programName,
    transition,
    2,
    false,
    [record, inputAddresses, inputAmounts],
    undefined,
    keyParams,
    undefined,
    undefined,
    undefined,
    privateKeyObject
  )
  return transaction_id
}

async function deployProgram(program) {
  const keyProvider = new AleoKeyProvider();
  keyProvider.useCache(true);

  // Create a record provider that will be used to find records and transaction data for Aleo programs
  const networkClient = new AleoNetworkClient("https://vm.aleo.org/api");

  // Use existing account with funds
  const account = new Account({
    privateKey: "user1PrivateKey",
  });

  const recordProvider = new NetworkRecordProvider(account, networkClient);

  // Initialize a program manager to talk to the Aleo network with the configured key and record providers
  const programManager = new ProgramManager(
    "https://vm.aleo.org/api",
    keyProvider,
    recordProvider,
  );

  programManager.setAccount(account);

  // Define a fee to pay to deploy the program
  const fee = 1.9; // 1.9 Aleo credits

  // Deploy the program to the Aleo network
  const tx_id = await programManager.deploy(program, fee);

  // Optional: Pass in fee record manually to avoid long scan times
  // const feeRecord = "{  owner: aleo1xxx...xxx.private,  microcredits: 2000000u64.private,  _nonce: 123...789group.public}";
  // const tx_id = await programManager.deploy(program, fee, undefined, feeRecord);

  return tx_id;
}

const workerMethods = { localProgramExecution, getPrivateKey, deployProgram, executeProgram };
expose(workerMethods);
