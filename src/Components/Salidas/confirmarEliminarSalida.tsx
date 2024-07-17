import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/react";

function confirmarEliminarSalida({
  isOpen,
  onOpen,
  onOpenChange,
  nombre,
}: any) {
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                ¿Seguro que quiere eliminar la salida hacia {nombre}?
              </ModalHeader>
              <ModalBody>
                <p className="text-red-600">Esta acción es permanente.</p>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row gap-1">
                  <Button onPress={onClose} className="bg-verde">
                    Cancelar
                  </Button>
                  <Button className=" bg-verdeFuerte text-[#ffffff]">
                    Eliminar
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default confirmarEliminarSalida;
