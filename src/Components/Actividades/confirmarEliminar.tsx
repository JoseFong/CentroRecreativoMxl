import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React from "react";

function ConfirmarEliminar() {
  return <div>ConfirmarEliminar</div>;
}

function ModalEliminar({
  isOpen,
  onOpenChange,
  actividad,
  fetchActividades,
}: {
  isOpen: any;
  onOpenChange: any;
  actividad: any;
  fetchActividades: () => void;
}) {
  const eliminar = () => {};

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                ¿Está seguro que desea eliminar esta actividad?
              </ModalHeader>
              <ModalBody>
                <p className="text-red-700">Esta acción es permanente.</p>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Cancelar</Button>
                <Button color="danger">Eliminar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ConfirmarEliminar;
