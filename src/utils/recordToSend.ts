type ValidateInputsParams = {
  records: any[]
  amounts: number[]
}

export const getSentRecord = ({
  records,
  amounts,
}: ValidateInputsParams): any | void => {
  const fullSendAmount = amounts
    .map((e: any) => parseInt(e))
    .reduce((acc: any, cur: any) => acc + cur)
  const amountRecords = records.map((r) =>
    parseInt(r.data.microcredits.replace('u64.private', ''))
  )
  let recordToSend
  for (let i = 0; i < records.length; i++) {
    const amountRec = amountRecords[i]
    if (amountRec < fullSendAmount) continue
    recordToSend = records[i]
  }
  if (!recordToSend) {
    recordToSend = new Error('Could not find record to send')
  }
  return recordToSend
}
