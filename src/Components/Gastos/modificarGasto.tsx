import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import ConfirmarModificarGasto from "./confirmarModificarGasto";

function ModificarGasto({
  gasto,
  onOpenChange,
  isOpen,
  fetchGastos,
}: {
  gasto: any;
  onOpenChange: any;
  isOpen: any;
  fetchGastos: any;
}) {
  const [concepto, setConcepto] = useState(gasto ? gasto.concepto : "");
  const [cantidad, setCantidad] = useState(gasto ? gasto.cantidad : "");
  const [fecha, setFecha] = useState(gasto ? gasto.fecha : "");
  const [data, setData] = useState();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Nuevo estado para el modal de confirmación

  useEffect(() => {
    if (gasto) {
      reset();
    }
  }, [gasto]);

  const reset = () => {
    if (gasto) {
      setConcepto(gasto.concepto.toUpperCase());
      setCantidad(gasto.cantidad);
      setFecha(gasto.fecha);
    }
  };

  const handleModificar = () => {
    if (gasto) {
      const dataTemp = {
        ...gasto,
        concepto: concepto.trim().toUpperCase(),
        cantidad: cantidad.trim(),
        fecha: fecha.trim(),
      };
      setData(dataTemp);
      setIsConfirmOpen(true); // Abre el modal de confirmación
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        <ModalHeader>Modificar Gasto</ModalHeader>
        <ModalBody>
          <Input
            label="Concepto"
            value={concepto}
            onValueChange={setConcepto}
          />
          <Input
            label="Cantidad"
            value={cantidad}
            onValueChange={setCantidad}
          />
          <Input
            disabled
            label="Fecha"
            type="date"
            value={fecha}
            onValueChange={setFecha}
          />
        </ModalBody>
        <ModalFooter>
          <Button onPress={() => onOpenChange(false)} className=" bg-verde">
            Cancelar
          </Button>
          <Button
            onPress={handleModificar}
            className=" bg-verdeFuerte text-[#ffffff]"
          >
            Modificar
          </Button>
        </ModalFooter>
      </ModalContent>
      <ConfirmarModificarGasto
        data={data}
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onModificar={onOpenChange}
        fetchGastos={fetchGastos}
      />
    </Modal>
  );
}

export default ModificarGasto;
