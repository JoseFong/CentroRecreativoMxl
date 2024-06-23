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
  data,
  isOpen,
  onOpenChange,
  nees,
  fetchAlumnos,
  reset,
}: {
  data: any;
  isOpen: any;
  onOpenChange: any;
  nees: any;
  fetchAlumnos: () => void;
  reset: () => void;
}) {
  return (
    <>
      {data && (
        <ModalConfirmarAlumno
          data={data}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          nees={nees}
          fetchAlumnos={fetchAlumnos}
          reset={reset}
        />
      )}
    </>
  );
}

function ModalConfirmarAlumno({
  data,
  isOpen,
  onOpenChange,
  nees,
  fetchAlumnos,
  reset,
}: {
  data: any;
  isOpen: any;
  onOpenChange: any;
  nees: any;
  fetchAlumnos: () => void;
  reset: () => void;
}) {
  const [fechaDisplay, setFechaDisplay] = useState("");

  const handleAceptar = async (onClose: any) => {
    try {
      const response = await axios.post("/api/alumnos", data);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Alumno registrado exitosamente.");
        fetchAlumnos();
        reset();
        onClose();
      } else {
        throw new Error(response.data.message);
      }
    } catch (e: any) {
      if (e.response.stauts === 404 || e.response.status === 500) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  };

  useEffect(() => {
    if (data.fechaNac.length !== 0) {
      const partes = data.fechaNac.split("-");
      const fecha = partes[2] + "/" + partes[1] + "/" + partes[0];
      setFechaDisplay(fecha);
    }
  }, [data]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                ¿Seguró que quiere registrar al siguiente alumno?
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
                    {fechaDisplay}
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
                  <p className="mt-3">
                    <span className="font-bold">Neurodivergencia(s): </span>
                    <div className="flex flex-col">
                      {nees.map((n: any) => (
                        <p>{n}</p>
                      ))}
                    </div>
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row gap-2">
                  <Button onPress={onClose} className=" bg-verde">Cancelar</Button>
                  <Button
                    className=" bg-verdeFuerte text-[#ffffff]"
                    onPress={() => handleAceptar(onClose)}
                  >
                    Aceptar
                  </Button>
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
