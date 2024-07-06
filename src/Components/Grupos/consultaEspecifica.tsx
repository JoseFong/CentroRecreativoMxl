import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import React from "react";

//ESTE ES EL COMPONENTE PRINCIPAL DE ESTE ARCHIVO
function ConsultaEspecificaGrupo({
  isOpen,
  onOpenChange,
  grupo,
  docente,
  alumnos,
}: {
  isOpen: any;
  onOpenChange: any;
  grupo: any;
  docente?: any;
  alumnos?: any;
}) {
  //CONTENIDO: La información del grupo
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Detalles del grupo {grupo.nombre}</ModalHeader>
              <ModalBody>
                <Table aria-label="Información del grupo">
                  <TableHeader>
                    <TableColumn>Campo</TableColumn>
                    <TableColumn>Información</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow key="nombre">
                      <TableCell>Nombre:</TableCell>
                      <TableCell>{grupo.nombre}</TableCell>
                    </TableRow>
                    <TableRow key="docente">
                      <TableCell>Docente:</TableCell>
                      <TableCell>
                        {docente ? docente.nombre : "Sin docente asignado"}
                      </TableCell>
                    </TableRow>
                    <TableRow key="alumnos">
                      <TableCell>Alumnos:</TableCell>
                      <TableCell>
                        {alumnos ? (
                          alumnos.map((alumno: any) => (
                            <p key={alumno.id}>
                              {alumno.nombre} {alumno.aPaterno}{" "}
                              {alumno.aMaterno}
                            </p>
                          ))
                        ) : (
                          <p>Sin alumnos asignados</p>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
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

export default ConsultaEspecificaGrupo;
