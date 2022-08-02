import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import { BASE_URL } from "../../constants";
import { Customer } from '../../types/customer.type';
import styles from './Customer.module.scss';
import {
  Text, Center, Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  useToast,
  Link
} from '@chakra-ui/react'
import EditCustomer from './components/EditCustomer';

const Customer: NextPage = () => {

  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const [openEditCustomerModal, setOpenEditCustomerModal] = useState(false);
  const onClose = () => {
    setOpenEditCustomerModal(false)
    setSelectedCustomer({} as Customer)
  }
  const toast = useToast()

  const addCustomer = (customer: Customer) => {
    fetch(BASE_URL + "customer", {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customer)
    })
      .then((res) => res.json())
      .then((resp) => {
        if (resp.success) {
          setCustomerList([...customerList, resp.data])
          setOpenEditCustomerModal(false)
        }
        else {
          toast({
            description: resp.error.description,
            status: "error",
          })
        }
      });
  }
  const updateCustomer = (customer: Customer) => {
    fetch(BASE_URL + "customer/" + customer.id, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customer)
    })
      .then((res) => res.json())
      .then((resp) => {
        if (resp.success) {
          const updatedCustomer = resp.data as Customer;
          for (const i in customerList) {
            if (customerList[i].id == updatedCustomer.id) {
              customerList[i] = updatedCustomer;
            }
          }
          setCustomerList(customerList)
          setOpenEditCustomerModal(false)
        }
        else {
          toast({
            description: resp.error.description,
            status: "error",
          })
        }
      });
  }
  const deleteCustomer = (id: number) => {
    fetch(BASE_URL + "customer/" + id, {
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
          const filteredCustomerList = customerList.filter(el => {
            return el.id != id
          }) as Customer[]
          setCustomerList(filteredCustomerList)
          setOpenEditCustomerModal(false)
        }
        else {
          toast({
            description: resp.error.description,
            status: "error",
          })
        }
      });
  }

  const openCustomerModal = (customer?: Customer) => {
    setSelectedCustomer(customer);
    setOpenEditCustomerModal(true);
  }

  useEffect(() => {
    fetch(BASE_URL + "customer")
      .then((res) => res.json())
      .then((data) => {
        setCustomerList(data.data)
      });
  }, []);

  return (
    <div className={styles.container}>
      <Center>
        <Text fontSize='3xl'>Customer List</Text>
      </Center>
      <Button onClick={() => openCustomerModal()}>Add Customer</Button>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Name</Th>
              <Th>Email Address</Th>
              <Th>Account Wallet Amount</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {customerList.length > 0 && (
              <>
                {customerList.map((customer: Customer) => {
                  return (
                    <Tr key={customer.id}>
                      <Td>{customer.id}</Td>
                      <Td>{customer.name}</Td>
                      <Td>{customer.emailAddress}</Td>
                      <Td>{customer.accountWalletAmount}</Td>
                      <Td>
                        <Link href={`customer/view?id=${customer.id}`}>
                          <Button>View</Button>
                        </Link>
                        <Button onClick={()=>openCustomerModal(customer)}>Edit</Button>
                        <Button onClick={()=>deleteCustomer(customer.id)}>Delete</Button>
                      </Td>
                    </Tr>
                  );
                })}
              </>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <EditCustomer
        isOpen={openEditCustomerModal}
        onClose={onClose}
        addCustomer={addCustomer}
        updateCustomer={updateCustomer}
        customer={selectedCustomer}
      ></EditCustomer>
    </div>
  )
}

export default Customer
