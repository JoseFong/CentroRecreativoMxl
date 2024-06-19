import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function ConfirmarRegistrarAlumno({
  isOpen,
  onOpenChange,
  data,
  nees,
  nee,
  fecha,
  fetchAlumnos,
  reset,
  fetchNees,
}: {
  onOpen: any;
  isOpen: any;
  onOpenChange: any;
  data: any;
  nees: any;
  nee: any;
  fecha: any;
  fetchAlumnos: () => void;
  reset: () => void;
  fetchNees: () => void;
}) {
  let neeDisplay: string = "";
  let nombres: string[] = [];
  let fechaDisplay: string = "";

  const [fechaFormato, setFechaFormato] = useState("");
  const [nombresDeNEEs, setNombresDeNEEs] = useState("");

  useEffect(() => {
    nombres = [];
    neeDisplay = "";

    if (fecha.length > 0) {
      const partes = fecha.split("-");
      fechaDisplay = partes[2] + "/" + partes[1] + "/" + partes[0];
      setFechaFormato(fechaDisplay);
    }
    if (nee.length > 0) {
      const partes = nee.split(",");
      partes.map((parte: string) => {
        const nee = nees.find((n: any) => n.id === parseInt(parte.trim()));
        nombres.push(nee.nombre);
      });
      for (let i = 0; i < nombres.length; i++) {
        neeDisplay = neeDisplay + nombres[i];
        if (i !== nombres.length - 1) {
          neeDisplay = neeDisplay + ", ";
        }
      }
      setNombresDeNEEs(neeDisplay);
    }
  }, [fecha, nee]);

  const handleAceptar = async (onClose2: any) => {
    try {
      const response = await axios.post("/api/alumnos", data);
      if (response.status === 200) {
        toast.success("Alumno registrado exitosamente.");
        fetchAlumnos();
        reset();
        onClose2();
        fetchNees();
      }
    } catch (e: any) {
      if (e.response.status === 500 || e.response.status === 404) {
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
          {(onClose2) => (
            <>
              <ModalHeader>
                ¿Seguro que quiere registrar el siguiente alumno?
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col">
                  <p>
                    <span className="font-bold">Nombre: </span>
                    {data.nombre} {data.aPaterno} {data.aMaterno}
                  </p>
                  <p>
                    <span className="font-bold">Género: </span>
                    {data.genero}
                  </p>
                  <p>
                    <span className="font-bold">Fecha de Nacimiento: </span>
                    {fechaFormato}
                  </p>
                  <p>
                    <span className="font-bold">Telefono del Tutor: </span>
                    {data.telefono}
                  </p>
                  {data.telefonoAl.trim() !== "" && (
                    <>
                      <p>
                        <span className="font-bold">Nombre: </span>
                        {data.telefonoAl}
                      </p>
                    </>
                  )}
                  <p>
                    <span className="font-bold">Dirección: </span>
                    {data.direccion}
                  </p>
                  <p>
                    <span className="font-bold">CURP: </span>
                    {data.curp}
                  </p>
                  <p>
                    <span className="font-bold">Neurodivergencia(s): </span>
                    {nombresDeNEEs}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row gap-2">
                  <Button
                    color="success"
                    onPress={() => handleAceptar(onClose2)}
                  >
                    Aceptar
                  </Button>
                  <Button onPress={onClose2}>Cancelar</Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ConfirmarRegistrarAlumno;
