import { Record } from "./record";

export interface SendInput {
    record: Record
    addresses: AddressesInput
    amounts: AmountsInput
}

export interface AddressesInput {
    address1: string
    address2: string
    address3: string
    address4: string
    address5: string
    address6: string
    address7: string
    address8: string
    address9: string
    address10: string
    address11: string
    address12: string
    address13: string
    address14: string
    address15: string
}

export interface AmountsInput {
    amount1: string
    amount2: string
    amount3: string
    amount4: string
    amount5: string
    amount6: string
    amount7: string
    amount8: string
    amount9: string
    amount10: string
    amount11: string
    amount12: string
    amount13: string
    amount14: string
    amount15: string
}