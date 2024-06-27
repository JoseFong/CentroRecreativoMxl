import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React from "react";
import { Pago } from "@prisma/client";
import toast from "react-hot-toast";
import axios from "axios";

function ConfirmarEliminar({
  isOpen,
  onOpenChange,
  pago,
  fetchPagos,
  handleClose,
}: {
  isOpen: any;
  onOpenChange: any;
  pago: any;
  fetchPagos: () => void;
  handleClose: () => void;
}) {
  return (
    <>
      {pago && (
        <ModalConfirmarEliminar
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          pago={pago}
          fetchPagos={fetchPagos}
          handleClose={handleClose}
        />
      )}
    </>
  );
}

function ModalConfirmarEliminar({
  isOpen,
  onOpenChange,
  pago,
  fetchPagos,
  handleClose,
}: {
  isOpen: any;
  onOpenChange: any;
  pago: any;
  fetchPagos: () => void;
  handleClose: () => void;
}) {
  const eliminar = async (onClose: any) => {
    try {
      const response = await axios.delete("/api/pagos/" + pago.id);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Pago eliminado exitosamente.");
        fetchPagos();
        handleClose();
        onClose();
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (e.response) {
        const s = e.response.status;
        if (s === 400 || s === 500 || s === 404) {
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
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose3) => (
            <>
              <ModalHeader>
                ¿Está seguro que desea eliminar el pago?
              </ModalHeader>
              <ModalBody>
                <p className="text-red-600">Esta operación es permanente.</p>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose3}>Cancelar</Button>
                <Button color="danger" onPress={() => eliminar(onClose3)}>
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ConfirmarEliminar;
