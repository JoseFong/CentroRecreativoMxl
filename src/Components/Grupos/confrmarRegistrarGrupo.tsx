import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";

function ConfirmarRegistrarGrupo({
  data,
  isOpen,
  onOpenChange,
  fetchGrupos,
  fetchAlumnos,
  reset,
  nombreDocente,
}: {
  data: any;
  isOpen: any;
  onOpenChange: any;
  fetchGrupos: () => void;
  fetchAlumnos: () => void;
  reset: () => void;
  nombreDocente: any;
}) {
  const handleAceptar = async (onClose: any) => {
    try {
      data.cantidad = parseFloat(data.cantidad);
      const response = await axios.post("/api/grupos", data);
      if (response.status === 200) {
        toast.success("Grupo modificado exitosamente.");
        if (fetchGrupos && fetchAlumnos) {
          fetchAlumnos();
          fetchGrupos();
        }
        // Cierra el modal
        reset();
        onClose();
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (e.response.status === 404 || e.response.status === 500) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              ¿Seguro que quiere registrar el siguiente grupo?
            </ModalHeader>
            <ModalBody>
              <p>
                <span className="font-bold">Nombre: </span>
                {data.nombre}
              </p>
              <p>
                <span className="font-bold">Docente: </span>
                {nombreDocente ?? "Sin docente asignado"}
              </p>
            </ModalBody>
            <ModalFooter>
              <div className="flex flex-row gap-2">
                <Button onPress={onClose} className=" bg-verde ">
                  Cancelar
                </Button>
                <Button
                  className=" bg-verdeFuerte text-[#ffffff]"
                  onPress={() => handleAceptar(onClose)}
                >
                  Registrar
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ConfirmarRegistrarGrupo;
