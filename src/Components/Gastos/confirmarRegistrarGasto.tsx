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
import { useState } from "react";

function ConfirmarRegistrarGasto({
  data,
  isOpen,
  onOpenChange,
  fetchGastos,
  reset,
}: {
  data: any;
  isOpen: any;
  onOpenChange: any;
  fetchGastos: () => void;
  reset: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleAceptar = async (onClose: any) => {
    try {
      setLoading(true);
      data.cantidad = parseFloat(data.cantidad);
      const response = await axios.post("/api/gastos", data);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Gasto registrado exitosamente.");
        fetchGastos();
        reset();
        onClose();
      } else {
        throw new Error(response.data.message);
      }
    } catch (e: any) {
      if (e.response.status === 404 || e.response.status === 500) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              ¿Seguro que quiere registrar el siguiente gasto?
            </ModalHeader>
            <ModalBody>
              <p>
                <span className="font-bold">Concepto: </span>
                {data.concepto}
              </p>
              <p>
                <span className="font-bold">Cantidad: </span>
                {data.cantidad}
              </p>
              <p>
                <span className="font-bold">Fecha: </span>
                {data.fecha}
              </p>
            </ModalBody>
            <ModalFooter>
              <div className="flex flex-row gap-2">
                <Button
                  color="success"
                  onPress={() => handleAceptar(onClose)}
                  isDisabled={loading}
                >
                  {loading ? "Registrando..." : "Aceptar"}
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

export default ConfirmarRegistrarGasto;
