import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button } from "@nextui-org/react";
import React from "react";

function ConsultaEspecificaGasto({ gasto, isOpen, onOpenChange }: { gasto: any; isOpen: any; onOpenChange: any; }) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Detalles del Gasto</ModalHeader>
            <ModalBody>
              <p>
                <span className="font-bold">Concepto: </span>
                {gasto.concepto}
              </p>
              <p>
                <span className="font-bold">Cantidad: </span>
                {gasto.cantidad}
              </p>
              <p>
                <span className="font-bold">Fecha: </span>
                {gasto.fecha}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button onPress={onClose}>Cerrar</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ConsultaEspecificaGasto;