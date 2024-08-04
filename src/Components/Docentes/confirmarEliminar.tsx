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

function confirmarEliminar({ isOpen, onOpenChange, docente }: any) {
  const handleEliminar = async (id: number) => {
    try {
      const response = await axios.delete(`/api/docentes/${id}`);
      console.log("Docente eliminado:", response.data);
      toast.success("Docente eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar docente:", error);
      toast.error("Error al eliminar docente");
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                ¿Seguro que quiere eliminar el registro de {docente.nombre}{" "}
                {docente.aPaterno}?
              </ModalHeader>
              <ModalBody>
                <p className="text-red-600">Esta acción es permanente.</p>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row gap-1">
                  <Button onPress={onClose} className="bg-verde">
                    Cancelar
                  </Button>
                  <Button
                    className=" bg-verdeFuerte text-[#ffffff]"
                    onPress={() => handleEliminar(docente.id)}
                  >
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

export default confirmarEliminar;
