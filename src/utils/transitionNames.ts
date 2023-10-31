export const getTransitionsNames = (amount: number) => {
  const obj: Record<number, string> = {
    1: 'transfer_one',
    2: 'transfer_two',
    3: 'transfer_three',
    4: 'transfer_four',
    5: 'transfer_five',
    6: 'transfer_six',
    7: 'transfer_seven',
    8: 'transfer_eight',
    9: 'transfer_nine',
    10: 'transfer_ten',
    11: 'transfer_eleven',
    12: 'transfer_twelve',
    13: 'transfer_thirteen',
    14: 'transfer_fourteen',
    15: 'transfer_fifteen',
  }
  return obj[amount]
}
