import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";

function ConfirmarRegistrarGrupo({
  data,
  isOpen,
  onOpenChange,
  fetchGrupos,
  reset,
  nombreDocente
}: {
  data: any;
  isOpen: any;
  onOpenChange: any;
  fetchGrupos: () => void;
  reset: () => void;
  nombreDocente: any;
}) {
  const handleAceptar = async (onClose: any) => {
    try {
      if (data.docenteId === "") {
        data.docenteId = null;
      }
      const response = await axios.post("/api/grupos", data);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Grupo registrado exitosamente.");
        fetchGrupos();
        reset();
        onClose();
      } else {
        throw new Error(response.data.message);
      }
    } catch (e: any) {
      if (e.response.status === 404 ||
          e.response.status === 500 ||
          e.response.status === 400
      ) {
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
            <ModalHeader>¿Seguro que quiere registrar el siguiente grupo?</ModalHeader>
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
                <Button
                  color="success"
                  onPress={() => handleAceptar(onClose)}
                >
                  Registrar
                </Button>
                <Button onPress={onClose}>Cancelar</Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ConfirmarRegistrarGrupo;