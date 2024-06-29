import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

function ConfirmarModificarGrupo({ data, isOpen, onOpenChange, fetchGrupos }: {
    data: any,
    isOpen: any,
    onOpenChange: any,
    fetchGrupos?: () => any,
}) {
    const handleConfirm = () => {
        // Aquí iría el código para modificar el grupo en la base de datos
        // usando los datos en `data`

        // Después de modificar el grupo, actualiza los grupos
        if (fetchGrupos) {
            fetchGrupos();
        }

        // Cierra el modal
        onOpenChange(false);
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>Confirmar Modificación</ModalHeader>
                <ModalBody>
                    ¿Estás seguro de que quieres modificar el grupo {data ? data.nombre : ""}?
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={handleConfirm}>
                        Confirmar
                    </Button>
                    <Button onClick={() => onOpenChange(false)}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default ConfirmarModificarGrupo;