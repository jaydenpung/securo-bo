import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import { BASE_URL } from "../../constants";
import styles from './Fund.module.scss';
import { Fund } from '../../types/fund.type';
import {
  Text, Center, Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  useToast
} from '@chakra-ui/react'
import EditFund from './components/EditFund';

const Fund: NextPage = () => {

  const [fundList, setFundList] = useState<Fund[]>([]);
  const [selectedFund, setSelectedFund] = useState<Fund>();
  const [openEditFundModal, setOpenEditFundModal] = useState(false);
  const onClose = () => {
    setOpenEditFundModal(false)
    setSelectedFund({} as Fund)
  }
  const toast = useToast()

  const addFund = (fund: Fund) => {
    fetch(BASE_URL + "fund", {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fund)
    })
      .then((res) => res.json())
      .then((resp) => {
        if (resp.success) {
          setFundList([...fundList, resp.data])
          setOpenEditFundModal(false)
        }
        else {
          toast({
            description: resp.error.description,
            status: "error",
          })
        }
      });
  }
  const updateFund = (fund: Fund) => {
    fetch(BASE_URL + "fund/" + fund.id, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fund)
    })
      .then((res) => res.json())
      .then((resp) => {
        if (resp.success) {
          const updatedFund = resp.data as Fund;
          for (const i in fundList) {
            if (fundList[i].id == updatedFund.id) {
              fundList[i] = updatedFund;
            }
          }
          setFundList(fundList)
          setOpenEditFundModal(false)
        }
        else {
          toast({
            description: resp.error.description,
            status: "error",
          })
        }
      });
  }
  const deleteFund = (id: number) => {
    fetch(BASE_URL + "fund/" + id, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id
      })
    })
      .then((res) => res.json())
      .then((resp) => {
        if (resp.success) {
          const filteredFundList = fundList.filter(el => {
            return el.id != id
          }) as Fund[]
          setFundList(filteredFundList)
          setOpenEditFundModal(false)
        }
        else {
          toast({
            description: resp.error.description,
            status: "error",
          })
        }
      });
  }

  const openFundModal = (fund?: Fund) => {
    setSelectedFund(fund);
    setOpenEditFundModal(true);
  }

  useEffect(() => {
    fetch(BASE_URL + "fund")
      .then((res) => res.json())
      .then((data) => {
        setFundList(data.data)
      });
  }, []);

  return (
    <div className={styles.container}>
      <Center>
        <Text fontSize='3xl'>Fund List</Text>
      </Center>
      <Button onClick={() => openFundModal()}>Add Fund</Button>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Minimum Invest Amount</Th>
              <Th>Investment balance</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {fundList.length > 0 && (
              <>
                {fundList.map((fund: Fund) => {
                  return (
                    <Tr key={fund.id}>
                      <Td>{fund.id}</Td>
                      <Td>{fund.fundName}</Td>
                      <Td>{fund.fundDescription}</Td>
                      <Td>{fund.minimumInvestAmount}</Td>
                      <Td>{fund.fundInvestmentBalance}</Td>
                      <Td>
                        <Button onClick={()=>openFundModal(fund)}>Edit</Button>
                        <Button onClick={()=>deleteFund(fund.id)}>Delete</Button>
                      </Td>
                    </Tr>
                  );
                })}
              </>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <EditFund
        isOpen={openEditFundModal}
        onClose={onClose}
        addFund={addFund}
        updateFund={updateFund}
        fund={selectedFund}
      ></EditFund>
    </div>
  )
}

export default Fund
