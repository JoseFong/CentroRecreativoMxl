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
import NeurodivergenciaDeAlumnos from "./NeurodivergenciaAlumnos";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";

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
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="md"
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                Detalles de {alumno.nombre} {alumno.aPaterno}
              </ModalHeader>
              <ModalBody>
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody>
                    <tr className="flex md:flex-row">
                      <td className="px-6 py-2 whitespace-nowrap font-bold">
                        Nombre:
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        {alumno.nombre} {alumno.aPaterno} {alumno.aMaterno}
                      </td>
                    </tr>
                    <tr className="flex md:flex-row">
                      {" "}
                      <td className="px-6 py-2 whitespace-nowrap font-bold">
                        Género:
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        {alumno.genero}
                      </td>
                    </tr>
                    <tr className="flex md:flex-row">
                      {" "}
                      <td className="px-6 py-2 whitespace-nowrap font-bold">
                        Fecha de Nacimiento:
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        {alumno.fechaNac}
                      </td>
                    </tr>
                    <tr className="flex md:flex-row">
                      {" "}
                      <td className="px-6 py-2 whitespace-nowrap font-bold">
                        Teléfono del Tutor:
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        {alumno.telefono}
                      </td>
                    </tr>
                    {alumno.telefonoAlumno ? (
                      <tr className="flex md:flex-row">
                        {" "}
                        <td className="px-6 py-2 whitespace-nowrap font-bold">
                          Teléfono del Alumno:
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap">
                          {alumno.telefonoAlumno}
                        </td>
                      </tr>
                    ) : (
                      <tr className="flex md:flex-row">
                        {" "}
                        <td className="px-6 py-2whitespace-nowrap font-bold">
                          Teléfono del Alumno:
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap font-bold">
                          No registrado
                        </td>
                      </tr>
                    )}
                    <tr className="flex md:flex-row">
                      {" "}
                      <td className="px-6 py-2whitespace-nowrap font-bold">
                        Dirección:
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        {alumno.direccion}
                      </td>
                    </tr>
                    <tr className="flex md:flex-row">
                      {" "}
                      <td className="px-6 py-2whitespace-nowrap font-bold">
                        CURP:
                      </td>
                      <td className="px-6 py-2whitespace-nowrap">
                        {alumno.curp}
                      </td>
                    </tr>
                    <tr className="flex md:flex-row">
                      {" "}
                      <td className="px-6 py-2 whitespace-nowrap font-bold">
                        Neurodivergencia(s):
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
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

export default ConsultaEspecificaAlumno;
