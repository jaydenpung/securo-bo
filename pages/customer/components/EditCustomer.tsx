import { Button } from "@chakra-ui/button"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Input } from "@chakra-ui/input"
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/modal"
import { useEffect, useState } from "react"
import { Customer } from "../../../types/customer.type"

const EditCustomer: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    addCustomer: (customer: Customer) => void,
    updateCustomer: (customer: Customer) => void,
    customer?: Customer,
}> = ({ isOpen, onClose, addCustomer, updateCustomer, customer = {} as Customer }) => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    useEffect(()=> {
        setName(customer.name || "")
        setEmail(customer.emailAddress || "")
    }, [customer.name, customer.emailAddress])



    const save = () => {
        customer.name = name;
        customer.emailAddress = email;
        if (customer.id) {
            updateCustomer(customer)
        }
        else {
            addCustomer(customer)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{customer.id? "Update Customer": "Add Customer"}</ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input value={name} placeholder='Name' onChange={(e) => { setName(e.target.value) }} />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Email Address</FormLabel>
                        <Input value={email} placeholder='Email Address' onChange={(e) => { setEmail(e.target.value) }} />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={save} colorScheme='blue' mr={3}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditCustomer