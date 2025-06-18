import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import NeurodivergenciaDeAlumnos from "./NeurodivergenciaAlumnos";

// Componente principal
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
                <div className="flex flex-col">
                  <div className="mb-3">
                    <span className="font-bold">Nombre: </span>
                    {alumno.nombre} {alumno.aPaterno} {alumno.aMaterno}
                  </div>
                  <div className="mb-3">
                    <span className="font-bold">Género: </span>
                    {alumno.genero}
                  </div>
                  <div className="mb-3">
                    <span className="font-bold">Fecha de Nacimiento: </span>
                    {alumno.fechaNac}
                  </div>
                  <div className="mb-3">
                    <span className="font-bold">Teléfono del Tutor: </span>
                    {alumno.telefono}
                  </div>
                  <div className="mb-3">
                    <span className="font-bold">Teléfono del Alumno: </span>
                    {alumno.telefonoAlumno
                      ? alumno.telefonoAlumno
                      : "No registrado"}
                  </div>
                  <div className="mb-3">
                    <span className="font-bold">Dirección: </span>
                    {alumno.direccion}
                  </div>
                  <div className="mb-3">
                    <span className="font-bold">CURP: </span>
                    {alumno.curp}
                  </div>
                  <div className="mb-3">
                    <span className="font-bold">Neurodivergencia(s): </span>
                    {alumno && <NeurodivergenciaDeAlumnos alumno={alumno} />}
                  </div>
                </div>
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
