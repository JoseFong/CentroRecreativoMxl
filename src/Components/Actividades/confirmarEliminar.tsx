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

function ConfirmarEliminarActividad({
  isOpen,
  onOpenChange,
  actividad,
  fetchActividades,
}: {
  isOpen: any;
  onOpenChange: any;
  actividad: any;
  fetchActividades: () => void;
}) {
  const handleEliminar = async (onClose: any) => {
    try {
      const response = await axios.delete("/api/actividades/" + actividad.id);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Actividad eliminada exitosamente.");
        fetchActividades();
        onClose();
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (e.response) {
        const s = e.response.status;
        if (s === 404 || s === 500 || s === 400) {
          toast.error(e.response.data.message);
        } else {
          toast.error(e.message);
        }
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
            <ModalHeader>¿Seguro que desea eliminar la actividad?</ModalHeader>
            <ModalBody>
              <p className="text-red-600">Esta acción es permanente.</p>
            </ModalBody>
            <ModalFooter>
              <Button onPress={onClose} className="bg-verde">Cancelar</Button>
              <Button color="danger" onPress={() => handleEliminar(onClose)}>
                Eliminar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ConfirmarEliminarActividad;
