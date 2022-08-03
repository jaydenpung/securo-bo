import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import { BASE_URL, TransactionType, TransactionTypeString } from "../../../constants";
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
    VStack,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { FundAllocation } from '../../../types/fundAllocation.type';
import { TradeHistory } from '../../../types/tradeHistory.type';
import { Fund } from '../../../types/fund.type';

const ViewCustomer: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    const [customer, setCustomer] = useState<Customer>();
    const [funds, setFunds] = useState<Fund[]>();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFundId, setSelectedFundId] = useState<number>();
    const [newFundId, setNewFundId] = useState<number>();
    const [transactionType, setTransactionType] = useState<TransactionType>();
    const [amount, setAmount] = useState(0);
    const toast = useToast()

    const depositWallet = (customerId: number, amount: number) => {
        fetch(BASE_URL + "trade/deposit-wallet", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerId: customerId,
                amount: amount,
            })
        })
            .then((res) => res.json())
            .then((resp) => {
                if (resp.success) {
                    const updatedCustomer = resp.data as Customer;
                    updatedCustomer.fundAllocations = customer?.fundAllocations || []; //this will not be returned
                    setCustomer(updatedCustomer);
                    onClose();
                }
                else {
                    toast({
                        description: resp.error.description,
                        status: "error",
                    })
                }
            });
    }

    const withdrawWallet = (customerId: number, amount: number) => {
        fetch(BASE_URL + "trade/withdraw-wallet", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerId: customerId,
                amount: amount,
            })
        })
            .then((res) => res.json())
            .then((resp) => {
                if (resp.success) {
                    const updatedCustomer = resp.data as Customer;
                    updatedCustomer.fundAllocations = customer?.fundAllocations || []; //this will not be returned
                    setCustomer(updatedCustomer);
                    onClose();
                }
                else {
                    toast({
                        description: resp.error.description,
                        status: "error",
                    })
                }
            });
    }

    const depositFund = (customerId: number, fundId: number, amount: number) => {
        fetch(BASE_URL + "trade/deposit-fund", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerId: customerId,
                fundId: fundId,
                amount: amount,
            })
        })
            .then((res) => res.json())
            .then((resp) => {
                if (resp.success) {
                    setCustomer(resp.data as Customer);
                    onClose();
                }
                else {
                    toast({
                        description: resp.error.description,
                        status: "error",
                    })
                }
            });
    }
    const withdrawFund = (customerId: number, fundId: number, amount: number) => {
        fetch(BASE_URL + "trade/withdraw-fund", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerId: customerId,
                fundId: fundId,
                amount: amount,
            })
        })
            .then((res) => res.json())
            .then((resp) => {
                if (resp.success) {
                    setCustomer(resp.data as Customer);
                    onClose();
                }
                else {
                    toast({
                        description: resp.error.description,
                        status: "error",
                    })
                }
            });
    }

    const openModal = (type: TransactionType, fundId?: number) => {
        setTransactionType(type);
        setSelectedFundId(fundId);
        setIsOpen(true);
    }
    const onClose = () => {
        setIsOpen(false);
        setAmount(0);
        setSelectedFundId(0);
        setNewFundId(0);
    }
    const execute = () => {
        if (customer) {
            console.log(selectedFundId)
            if (transactionType == TransactionType.DEPOSIT_WALLET) {
                depositWallet(customer.id, amount)
            }
            else if (transactionType == TransactionType.WITHDRAW_WALLET) {
                withdrawWallet(customer.id, amount)
            }
            else if (transactionType == TransactionType.DEPOSIT_FUND) {
                const fundId = selectedFundId || newFundId
                if (fundId) {
                    depositFund(customer.id, fundId, amount)
                }
            }
            else if (transactionType == TransactionType.WITHDRAW_FUND && selectedFundId) {
                withdrawFund(customer.id, selectedFundId, amount)
            }
        }
    }

    useEffect(() => {
        fetch(BASE_URL + "customer/" + id)
            .then((res) => res.json())
            .then((data) => {
                setCustomer(data.data)
            });
        fetch(BASE_URL + "fund")
            .then((res) => res.json())
            .then((data) => {
                setFunds(data.data)
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
                            <Button onClick={() => openModal(TransactionType.DEPOSIT_WALLET)}>Deposit Wallet</Button>
                            <Button onClick={() => openModal(TransactionType.WITHDRAW_WALLET)}>Withdraw Wallet</Button>
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
                                                            <Button onClick={() => { openModal(TransactionType.DEPOSIT_FUND); setSelectedFundId(fundAllocation.id) }}>Deposit</Button>
                                                            <Button onClick={() => { openModal(TransactionType.WITHDRAW_FUND); setSelectedFundId(fundAllocation.id) }}>Withdraw</Button>
                                                        </Td>
                                                    </Tr>
                                                );
                                            })}
                                        </>
                                    )}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        <Button onClick={() => openModal(TransactionType.DEPOSIT_FUND)}>Deposit new fund</Button>
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
                                        <Th>Fund (If any)</Th>
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
                                                        <Td>{tradeHistory.fundId} - {
                                                            funds && (
                                                                funds.find((fund) => fund.id == tradeHistory.fundId)?.fundName
                                                            )
                                                        }</Td>
                                                    </Tr>
                                                );
                                            })}
                                        </>
                                    )}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </VStack>
                    <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Enter Amount</ModalHeader>
                            <ModalCloseButton />

                            {
                                !selectedFundId && transactionType === TransactionType.DEPOSIT_FUND && (
                                    <>
                                        <ModalBody pb={6}>
                                            <FormControl mt={4}>
                                                <FormLabel>Fund</FormLabel>
                                                <Select placeholder='select funds' onChange={(e) => {setNewFundId(parseInt(e.target.value))}}>
                                                    {funds && (
                                                        <>
                                                            {funds.map((fund: Fund) => {
                                                                return (
                                                                    <option key={fund.id} value={fund.id}>{fund.fundName}</option>
                                                                );
                                                            })}
                                                        </>
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </ModalBody>
                                    </>
                                )
                            }

                            <ModalBody pb={6}>
                                <FormControl mt={4}>
                                    <FormLabel>Amount</FormLabel>
                                    <Input type="number" onChange={(e) => { setAmount((parseFloat(e.target.value)) as number) }} />
                                </FormControl>
                            </ModalBody>

                            <ModalFooter>
                                <Button onClick={execute} colorScheme='blue' mr={3}>
                                    Execute
                                </Button>
                                <Button onClick={onClose}>Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </div>
            )}
        </>
    )
}

export default ViewCustomer
