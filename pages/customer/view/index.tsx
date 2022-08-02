import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import { BASE_URL, TransactionTypeString } from "../../../constants";
import { Customer } from '../../../types/customer.type';
import styles from "./ViewCustomer.module.scss";
import {
    Text, Center,
    useToast,
    Flex,
    Button,
    Link,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    VStack
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { FundAllocation } from '../../../types/fundAllocation.type';
import { TradeHistory } from '../../../types/tradeHistory.type';

const ViewCustomer: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    const [customer, setCustomer] = useState<Customer>();
    const toast = useToast()

    useEffect(() => {
        fetch(BASE_URL + "customer/" + id)
            .then((res) => res.json())
            .then((data) => {
                setCustomer(data.data)
            });
    }, [id]);

    return (
        <>
            {customer && (
                <div>
                    <Center>
                        <Text fontSize='3xl'>Customer Report</Text>
                    </Center>

                    <VStack className={styles.customerReportStack}>
                        <Flex className={styles.customerDetails}>
                            <Text>Name: {customer.name}</Text>
                            <Text>Email: {customer.emailAddress}</Text>
                            <Text>Wallet Balance: {customer.accountWalletAmount}</Text>
                        </Flex>
                        <Text fontSize='2xl'>Invested Funds</Text>
                        <TableContainer>
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th>Id</Th>
                                        <Th>Name</Th>
                                        <Th>Description</Th>
                                        <Th>Minimum Invest Amount</Th>
                                        <Th>Customer Invested Amount</Th>
                                        <Th>Fund Total Investment</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {customer.fundAllocations?.length > 0 && (
                                        <>
                                            {customer.fundAllocations.map((fundAllocation: FundAllocation) => {
                                                return (
                                                    <Tr key={fundAllocation.id}>
                                                        <Td>{fundAllocation.id}</Td>
                                                        <Td>{fundAllocation.fundName}</Td>
                                                        <Td>{fundAllocation.fundDescription}</Td>
                                                        <Td>{fundAllocation.minimumInvestAmount}</Td>
                                                        <Td>{fundAllocation.userInvestedBalance}</Td>
                                                        <Td>{fundAllocation.fundInvestmentBalance}</Td>
                                                        <Td>
                                                            <Button>Deposit</Button>
                                                            <Button>Withdraw</Button>
                                                        </Td>
                                                    </Tr>
                                                );
                                            })}
                                        </>
                                    )}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        <Text fontSize='2xl'>Trade History</Text>
                        <TableContainer>
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th>Transaction Date</Th>
                                        <Th>Starting Balance</Th>
                                        <Th>Ending Balance</Th>
                                        <Th>Transaction Amount</Th>
                                        <Th>Transaction Type</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {customer.tradeHistories?.length > 0 && (
                                        <>
                                            {customer.tradeHistories.map((tradeHistory: TradeHistory) => {
                                                return (
                                                    <Tr key={tradeHistory.id}>
                                                        <Td>{tradeHistory.transactionDate.toString()}</Td>
                                                        <Td>{tradeHistory.startingBalance}</Td>
                                                        <Td>{tradeHistory.endingBalance}</Td>
                                                        <Td>{tradeHistory.transactionAmount}</Td>
                                                        <Td>{TransactionTypeString[tradeHistory.transactionType]}</Td>
                                                    </Tr>
                                                );
                                            })}
                                        </>
                                    )}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </VStack>
                </div>
            )}
        </>
    )
}

export default ViewCustomer
