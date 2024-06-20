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

//ESTE ES EL COMPONENTE PRINCIPAL DE ESTE ARCHIVO
function ConsultaEspecificaAlumno({
  isOpen,
  onOpenChange,
  alumno,
}: {
  isOpen: any;
  onOpenChange: any;
  alumno: any;
}) {
  //CONTENIDO: La información del alumno
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
                        <span className="font-bold">Teléfono del alumno: </span>
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
                    {
                      alumno && (
                        <NeurodivergenciaDeAlumnos alumno={alumno} />
                      ) /*Solo se monta el componente cuando existe el alumno*/
                    }
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

/*Este es un componente distinto al componente de consultaEspecifica, esto para que el useEffect
que viene aqui solo se ejecute cuando ESTE componente se monte, porque si no, va a querer hacer
el fetch de las neurodivergencias a cada rato aunque no exista alumno y va a causar errores.*/
function NeurodivergenciaDeAlumnos({ alumno }: { alumno: any }) {
  //Neurodivergencias del alumno
  const [nees, setNees] = useState([]);

  //Se ejecuta cuando se monta este componente, manda llamar la función
  useEffect(() => {
    fetchNeesDeAlumno();
  }, []);

  //Consigue las neurodivergencias de un alumno especificamente.
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

  //Por cada neurodivergencia se ponen en un listado vertical
  return (
    <p className="flex flex-col">
      {nees.map((n: any) => (
        <p>{n.nombre}</p>
      ))}
    </p>
  );
}

export default ConsultaEspecificaAlumno;
