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
import toast from "react-hot-toast";

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
    const [ano, mes, dia] = fecha.split("-");
    const fechaIngresada = new Date(
      parseInt(ano),
      parseInt(mes) - 1,
      parseInt(dia)
    ); //Se crea una fecha con la fecha ingresada
    const fechaHoy = new Date(); //Se crea una fecha con el día de hoy

    //Se verifica si la fecha es superior a la fecha actual
    if( concepto.trim() === "" || cantidad.trim() === "" || fecha.trim() === "") {
        toast.error("No deje campos en blanco.");
        return;
    }
    if( parseFloat(cantidad) < 0) {
        toast.error("La cantidad no puede ser negativa.");
        return;
    }
    if (fechaIngresada > fechaHoy) {
      toast.error("La fecha no puede superar la fecha actual");
      return;
    } else if (fechaIngresada.getMonth() < fechaHoy.getMonth()) {
      toast.error("La fecha no puede ser del mes anterior.");
      return;
    } else if (fechaIngresada.getFullYear() < fechaHoy.getFullYear()) {
        toast.error("La fecha no puede ser de un año anterior.");
        return;
    }

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
            type="number"
            label="Cantidad"
            value={cantidad}
            onValueChange={setCantidad}
          />
          <Input
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
