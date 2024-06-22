import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";

function ConfirmarModificarGasto({isOpen, onOpenChange, data, fetchGastos} : {
    isOpen: any,
    onOpenChange: any,
    data: any,
    fetchGastos: any
}) {
    const modificar = async () => {
        try {
            data.cantidad = parseFloat(data.cantidad);
            const response = await axios.patch("/api/gastos/" + data.id, data);
            if (response.status === 200) {

                toast.success("Gasto modificado exitosamente.");
                fetchGastos();
                onOpenChange(false);
            } else {
                throw new Error(response.data.message || "Error desconocido.");
            }
        } catch (e: any) {
            if (e.response.status === 404 || e.response.status === 500) {
                toast.error(e.response.data.message);
            } else {
                toast.error(e.message);
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>¿Seguro que quieres modificar este gasto?</ModalHeader>
                <ModalBody>
                    {data && (
                        <>
                            <p><strong>Concepto:</strong> {data.concepto}</p>
                            <p><strong>Cantidad:</strong> {data.cantidad}</p>
                            <p><strong>Fecha:</strong> {data.fecha}</p>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button onPress={modificar} color="success">Aceptar</Button>
                    <Button onPress={() => onOpenChange(false)}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default ConfirmarModificarGasto;