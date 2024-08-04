import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";

function confirmarModificar({ isOpen, onOpenChange, data, docente }: any) {
  const handleAceptar = async () => {
    try {
      const response = await axios.put(`/api/docentes/${docente.id}`, data);
      console.log("Docente modificado:", response.data);
      toast.success("Docente modificado con éxito");
    } catch (error) {
      console.error("Error al modificar docente:", error);
      toast.error("Error al modificar docente");
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                ¿Seguró que quiere registrar al siguiente docente?
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col">
                  <p>
                    <span className="font-bold">Nombre: </span>
                    {data.nombre} {data.aPaterno} {data.aMaterno}
                  </p>
                  <p>
                    <span className="font-bold">Fecha de Nacimiento: </span>
                    {data.fechaNac}
                  </p>
                  <p>
                    <span className="font-bold">Telefono: </span>
                    {data.telefono}
                  </p>
                  <p>
                    <span className="font-bold">Correo: </span>
                    {data.correo}
                  </p>
                  <p>
                    <span className="font-bold">CURP: </span>
                    {data.curp}
                  </p>

                  <p>
                    <span className="font-bold">Usuario: </span>
                    {data.usuario}
                  </p>
                  <p>
                    <span className="font-bold">Contraseña: </span>
                    {data.contrasena}
                  </p>
                  <p>
                    <span className="font-bold">Rol: </span>
                    {data.rol === "doc" ? "Docente" : "Director"}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row gap-2">
                  <Button onPress={onClose} className=" bg-verde">
                    Cancelar
                  </Button>
                  <Button
                    className=" bg-verdeFuerte text-[#ffffff]"
                    onPress={() => handleAceptar()}
                  >
                    Modificar
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

export default confirmarModificar;
