import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";

function confirmarEliminarSalida({
  isOpen,
  onOpenChange,
  salida,
  refetch,
}: any) {
  const handleEliminar = async () => {
    try {
      const response = await axios.delete(`/api/salidas/${salida.id}`);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Salida eliminada con éxito");
      } else {
        throw new Error("Error al eliminar la salida");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error desconocido al eliminar la salida"
      );
    } finally {
      onOpenChange();
      refetch();
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                ¿Seguro que quiere eliminar la salida hacia {salida.nombre}?
              </ModalHeader>
              <ModalBody>
                <p className="text-red-600">Esta acción es permanente.</p>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row gap-1">
                  <Button onPress={onClose} className="bg-verde">
                    Cancelar
                  </Button>
                  <Button  onClick={handleEliminar} className=" bg-verdeFuerte text-[#ffffff]">
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
