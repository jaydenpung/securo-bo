import { Button } from "@chakra-ui/button"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Input } from "@chakra-ui/input"
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/modal"
import { useEffect, useState } from "react"
import { Fund } from "../../../types/fund.type"

const EditFund: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    addFund: (fund: Fund) => void,
    updateFund: (fund: Fund) => void,
    fund?: Fund,
}> = ({ isOpen, onClose, addFund, updateFund, fund = {} as Fund }) => {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [minInvestAmount, setMinInvestAmount] = useState(0)

    useEffect(()=> {
        setName(fund.fundName || "")
        setDescription(fund.fundDescription || "")
        setMinInvestAmount(fund.minimumInvestAmount || 0)
    }, [fund.fundName, fund.fundDescription, fund.minimumInvestAmount])

    const save = () => {
        fund.fundName = name;
        fund.fundDescription = description;
        fund.minimumInvestAmount = minInvestAmount;
        if (fund.id) {
            updateFund(fund)
        }
        else {
            addFund(fund)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Fund</ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input value={name} placeholder='Name' onChange={(e) => { setName(e.target.value) }} />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Description</FormLabel>
                        <Input value={description} placeholder='Description' onChange={(e) => { setDescription(e.target.value) }} />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Minimum Invest Amount</FormLabel>
                        <Input type="number" value={minInvestAmount} placeholder='0' onChange={(e) => { setMinInvestAmount(parseInt(e.target.value)) }} />
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

export default EditFund