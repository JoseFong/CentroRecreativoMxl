import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import RegistrarSalida from "./registrarSalida";

function EditarSalida({ isOpen, onOpen, onOpenChange }: any) {
  return (
    <div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modificar salida
              </ModalHeader>
              <ModalBody>
                <RegistrarSalida esRegistro={false} />
              </ModalBody>
              <ModalFooter>
                <Button className="bg-verde" onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  className="bg-verdeFuerte text-[#ffffff]"
                  onPress={onClose}
                >
                  Modificar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default EditarSalida;
