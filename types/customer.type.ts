import { FundAllocation } from "./fundAllocation.type"
import { TradeHistory } from "./tradeHistory.type"

export type Customer = {
    id: number,
    name: string,
    emailAddress: string,
    accountWalletAmount: number,
    tradeHistories: TradeHistory[],
    fundAllocations: FundAllocation[],
}