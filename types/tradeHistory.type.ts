import { TransactionType } from "../constants"

export type TradeHistory = {
    id: number,
    startingBalance: number,
    endingBalance: number,
    transactionAmount: number,
    transactionDate: Date,
    transactionType: TransactionType,
}