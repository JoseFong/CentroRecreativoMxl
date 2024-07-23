import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React from "react";

function ConsultaEspecificaAct({
  actividad,
  isOpen,
  onOpenChange,
}: {
  actividad: any;
  isOpen: any;
  onOpenChange: any;
}) {
  return (
    <>
      {actividad && (
        <ConsultaEspecificaActModal
          actividad={actividad}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
    </>
  );
}

function ConsultaEspecificaActModal({
  actividad,
  isOpen,
  onOpenChange,
}: {
  actividad: any;
  isOpen: any;
  onOpenChange: any;
}) {
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                Detalles de la actividad '{actividad.nombre}'
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col">
                  <p>
                    <span className="font-bold">Nombre: </span>
                    {actividad.nombre}
                  </p>
                  {actividad.descripcion !== "" && (
                    <p>
                      <span className="font-bold">Descripción: </span>
                      {actividad.descripcion}
                    </p>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Cerrar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ConsultaEspecificaAct;
