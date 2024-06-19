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

function NeurodivergenciaDeAlumnos({ alumno }: { alumno: any }) {
  const [nees, setNees] = useState([]);

  useEffect(() => {
    fetchNeesDeAlumno();
  }, []);

  const fetchNeesDeAlumno = async () => {
    try {
      const response = await axios.get("/api/nee/neesDeAlumno/" + alumno.id);
      if (response.status >= 200 && response.status < 300) {
        setNees(response.data);
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
    <p className="flex flex-col">
      {nees.map((n: any) => (
        <p>{n.nombre}</p>
      ))}
    </p>
  );
}

function ConsultaEspecificaAlumno({
  isOpen,
  onOpenChange,
  alumno,
}: {
  isOpen: any;
  onOpenChange: any;
  alumno: any;
}) {
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                Detalles de {alumno.nombre} {alumno.aPaterno}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col">
                  <p>
                    <span className="font-bold">Nombre: </span>
                    {alumno.nombre} {alumno.aPaterno} {alumno.aMaterno}
                  </p>
                  <p>
                    <span className="font-bold">Género: </span>
                    {alumno.genero}
                  </p>
                  <p>
                    <span className="font-bold">Fecha de Nacimiento: </span>
                    {alumno.fechaNac}
                  </p>
                  <p>
                    <span className="font-bold">Telefono del Tutor: </span>
                    {alumno.telefono}
                  </p>
                  {alumno.telefonoAlumno.trim() !== "" && (
                    <>
                      <p>
                        <span className="font-bold">Nombre: </span>
                        {alumno.telefonoAlumno}
                      </p>
                    </>
                  )}
                  <p>
                    <span className="font-bold">Dirección: </span>
                    {alumno.direccion}
                  </p>
                  <p>
                    <span className="font-bold">CURP: </span>
                    {alumno.curp}
                  </p>
                  <p className="mt-3">
                    <span className="font-bold">Neurodivergencia(s): </span>
                    {alumno && <NeurodivergenciaDeAlumnos alumno={alumno} />}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Cerrar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ConsultaEspecificaAlumno;
