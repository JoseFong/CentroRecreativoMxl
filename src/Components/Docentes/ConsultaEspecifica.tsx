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

export default function consultaEspecifica({
  isOpen,
  onOpen,
  onOpenChange,
  docente,
}: any) {
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Detalles docente
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col">
                  <div className="mb-3">
                    <p>
                      <span className="font-bold">Nombre: </span>
                      {docente.nombre} {docente.aPaterno} {docente.aMaterno}
                    </p>
                  </div>
                  <div className="mb-3">
                    <p>
                      <span className="font-bold">Fecha de Nacimiento: </span>
                      {docente.fechaNac}
                    </p>
                  </div>
                  <div className="mb-3">
                    <p>
                      <span className="font-bold">Telefono: </span>
                      {docente.telefono}
                    </p>
                  </div>
                  <div className="mb-3">
                    <p>
                      <span className="font-bold">Correo: </span>
                      {docente.correo}
                    </p>
                  </div>
                  <div className="mb-3">
                    <p>
                      <span className="font-bold">CURP: </span>
                      {docente.curp}
                    </p>
                  </div>
                  {/* <div className="mb-3">
                    <p>
                      <span className="font-bold">Usuario: </span>
                      {docente.usuario}
                    </p>
                  </div>
                  <div className="mb-3">
                    <p>
                      <span className="font-bold">Contraseña: </span>
                      {docente.contrasena}
                    </p>
                  </div> */}
                  <div className="mb-3">
                    <p>
                      <span className="font-bold">Rol: </span>
                      {docente.rol === "doc" ? "Docente" : "Director"}
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  className=" bg-verdeFuerte text-[#ffffff]"
                  onPress={onClose}
                >
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
