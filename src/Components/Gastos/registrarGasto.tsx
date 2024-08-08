import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmarRegistrarGasto from "./confirmarRegistrarGasto";

function RegistrarGasto({
  isOpen,
  onOpenChange,
  fetchGastos,
}: {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  fetchGastos: any;
}) {
  const [concepto, setConcepto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [fecha, setFecha] = useState("");

  const {
    onOpen: onConfirmarOpen,
    isOpen: isConfirmarOpen,
    onOpenChange: onConfirmarOpenChange,
  } = useDisclosure();

  const handleRegistrar = () => {
    if (
      concepto.trim() === "" ||
      cantidad.trim() === "" ||
      fecha.trim() === ""
    ) {
      toast.error("No deje campos en blanco.");
      return;
    }

    if (parseFloat(cantidad) < 0) {
      toast.error("La cantidad no puede ser negativa.");
      return;
    }

    const [ano, mes, dia] = fecha.split("-");
    const fechaIngresada = new Date(
      parseInt(ano),
      parseInt(mes) - 1,
      parseInt(dia)
    ); //Se crea una fecha con la fecha ingresada
    const fechaHoy = new Date(); //Se crea una fecha con el día de hoy

    //Se verifica si la fecha es superior a la fecha actual
    if (fechaIngresada > fechaHoy) {
      toast.error("La fecha no puede superar la fecha actual.");
      return;
    } else if (fechaIngresada.getMonth() < fechaHoy.getMonth()) {
      toast.error("La fecha no puede ser del mes anterior.");
      return;
    }

    setConcepto(concepto.toUpperCase());

    onConfirmarOpen();
  };

  const reset = () => {
    setConcepto("");
    setCantidad("");
    setFecha("");
  };

  useEffect(() => {
    reset();
  }, [isOpen === false]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          <ModalHeader>Registrar Gasto</ModalHeader>
          <ModalBody>
            <Input
              isRequired
              type="text"
              label="Concepto"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
            />
            <Input
              isRequired
              type="number"
              label="Cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
            <Input
              isRequired
              type="date"
              label="Fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                onOpenChange(false);
                reset();
              }}
              className=" bg-verde"
            >
              Cancelar
            </Button>

            <Button
              onClick={handleRegistrar}
              className=" bg-verdeFuerte text-[#ffffff]"
            >
              Registrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ConfirmarRegistrarGasto
        data={{ concepto, cantidad, fecha }}
        isOpen={isConfirmarOpen}
        onOpenChange={onConfirmarOpenChange}
        fetchGastos={fetchGastos}
        reset={reset}
        onRegistrar={onOpenChange}
      />
    </>
  );
}

export default RegistrarGasto;
