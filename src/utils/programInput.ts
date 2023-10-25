import { AddressesInput, AmountsInput } from '../types/program'

export const createAddressesInput = (addresses: string[]): AddressesInput => {
  const addressesInput: any = {}

  for (let i = 1; i <= addresses.length; i++) {
    const propertyName = `address${i}`
    addressesInput[propertyName] =
      i - 1 < addresses.length ? addresses[i - 1] : addresses[0]
  }

  return addressesInput as AddressesInput
}

export const createAmountsInput = (amounts: string[]): AmountsInput => {
  const amuntsInput: any = {}
  for (let i = 1; i <= amounts.length; i++) {
    const propertyName = `amount${i}`
    amuntsInput[propertyName] =
      (i - 1 < amounts.length ? amounts[i - 1] : '0') + 'u64'
  }

  return amuntsInput as AmountsInput
}
