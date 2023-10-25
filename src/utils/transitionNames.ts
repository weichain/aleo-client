export const getTransitionsNames = (amount: number) => {
    const obj: Record<number, string[]> = {
      1: ["transfer_one"],
      2: ["transfer_two"],
      3: ["transfer_three"],
      4: ["transfer_four"],
      5: ["transfer_five"],
      6: ["transfer_one", "transfer_five"],
      7: ["transfer_two", "transfer_five"],
      8: ["transfer_three", "transfer_five"],
      9: ["transfer_four", "transfer_five"],
      10: ["transfer_ten"],
      11: ["transfer_one", "transfer_ten"],
      12: ["transfer_two", "transfer_ten"],
      13: ["transfer_three", "transfer_ten"],
      14: ["transfer_four", "transfer_ten"],
      15: ["transfer_five", "transfer_ten"]
    }
  return obj[amount]
}

export const getNumberPerTransition = (amount: number) => {
  const obj: Record<number, number[]> = {
    1: [1],
    2: [2],
    3: [3],
    4: [4],
    5: [5],
    6: [1, 5],
    7: [2, 5],
    8: [3, 5],
    9: [4, 5],
    10: [10],
    11: [1, 10],
    12: [2, 10],
    13: [3, 10],
    14: [4, 10],
    15: [5, 10]
  }
return obj[amount]
}