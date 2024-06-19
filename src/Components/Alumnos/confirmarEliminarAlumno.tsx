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
import toast, { useToasterStore } from "react-hot-toast";

function ConfirmarEliminarAlumno({
  isOpen,
  onOpenChange,
  alumno,
  fetchAlumnos,
}: {
  isOpen: any;
  onOpenChange: any;
  alumno: any;
  fetchAlumnos: () => void;
}) {
  const handleEliminar = async (onClose: any) => {
    try {
      const response = await axios.delete("/api/alumnos/" + alumno.id);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Se eliminó el registro del alumno exitosamente");
        fetchAlumnos();
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
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                ¿Seguro que quiere eliminar el registro de {alumno.nombre}{" "}
                {alumno.aPaterno}?
              </ModalHeader>
              <ModalBody>
                <p className="text-red-600">Esta acción es permanente.</p>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row gap-1">
                  <Button
                    color="danger"
                    onPress={() => handleEliminar(onClose)}
                  >
                    Eliminar
                  </Button>
                  <Button onPress={onClose}>Cancelar</Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ConfirmarEliminarAlumno;
