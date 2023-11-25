export const functionsPrivate = {
  transfer_one: 'transfer_one',
  transfer_two: 'transfer_two',
  transfer_three: 'transfer_three',
  transfer_four: 'transfer_four',
  transfer_five: 'transfer_five',
  transfer_six: 'transfer_six',
  transfer_seven: 'transfer_seven',
  transfer_eight: 'transfer_eight',
  transfer_nine: 'transfer_nine',
  transfer_ten: 'transfer_ten',
  transfer_eleven: 'transfer_eleven',
  transfer_twelve: 'transfer_twelve',
  transfer_thirteen: 'transfer_thirteen',
  transfer_fourteen: 'transfer_fourteen',
  transfer_fifteen: 'transfer_fifteen',
}

const map: Record<number, string> = {
  1: functionsPrivate.transfer_one,
  2: functionsPrivate.transfer_two,
  3: functionsPrivate.transfer_three,
  4: functionsPrivate.transfer_four,
  5: functionsPrivate.transfer_five,
  6: functionsPrivate.transfer_six,
  7: functionsPrivate.transfer_seven,
  8: functionsPrivate.transfer_eight,
  9: functionsPrivate.transfer_nine,
  10: functionsPrivate.transfer_ten,
  11: functionsPrivate.transfer_eleven,
  12: functionsPrivate.transfer_twelve,
  13: functionsPrivate.transfer_thirteen,
  14: functionsPrivate.transfer_fourteen,
  15: functionsPrivate.transfer_fifteen,
}

export const getTransitionsNames = (amount: number) => map[amount]

export const getTransitionName = (fn: string) =>
  Object.values(map).find((f) => f === fn)
