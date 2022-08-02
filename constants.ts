export const BASE_URL = "http://ssh.jaypung.com:8000"

export enum TransactionType {
    DEPOSIT_WALLET,
    WITHDRAW_WALLET,
    DEPOSIT_FUND,
    WITHDRAW_FUND,
}

export const TransactionTypeString = {
    0: "Deposit to wallet",
    1: "Withdraw from wallet",
    2: "Deposit to fund",
    3: "Withdraw from fund",
}