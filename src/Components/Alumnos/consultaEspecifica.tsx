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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                Detalles de {alumno.nombre} {alumno.aPaterno}
              </ModalHeader>
              <ModalBody>
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">
                        Nombre:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {alumno.nombre} {alumno.aPaterno} {alumno.aMaterno}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">
                        Género:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {alumno.genero}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">
                        Fecha de Nacimiento:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {alumno.fechaNac}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">
                        Teléfono del Tutor:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {alumno.telefono}
                      </td>
                    </tr>
                    {alumno.telefonoAlumno.trim() !== "" && (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-bold">
                          Teléfono del Alumno:
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {alumno.telefonoAlumno}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">
                        Dirección:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {alumno.direccion}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">
                        CURP:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {alumno.curp}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">
                        Neurodivergencia(s):
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {alumno && (
                          <NeurodivergenciaDeAlumnos alumno={alumno} />
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </ModalBody>
              <ModalFooter>
                <Button
                  onPress={onClose}
                  className=" bg-verdeFuerte text-[#ffffff]"
                >
                  Cerrar
                </Button>
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
