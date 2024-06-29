import React, { useState } from "react";
import { Pago } from "@prisma/client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import deleteIcon from "@/Assets/deleteIcon.png";
import ConfirmarEliminar from "./confirmarEliminar";

function ConsultaInscripcion({
  isOpen,
  onOpenChange,
  pago,
  alumno,
  fetchPagos,
}: {
  isOpen: any;
  onOpenChange: any;
  pago: any;
  alumno: string;
  fetchPagos: () => void;
}) {
  return (
    <>
      {pago && (
        <InfoPago
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          pago={pago}
          alumno={alumno}
          fetchPagos={fetchPagos}
        />
      )}
    </>
  );
}

function InfoPago({
  isOpen,
  onOpenChange,
  pago,
  alumno,
  fetchPagos,
}: {
  isOpen: any;
  onOpenChange: any;
  pago: any;
  alumno: string;
  fetchPagos: () => void;
}) {
  const {
    isOpen: isDelOpen,
    onOpen: onDelOpen,
    onOpenChange: onDelOpenChange,
  } = useDisclosure();

  const handleEliminar = () => {
    onDelOpen();
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Inscripcion de {alumno}</ModalHeader>
              <ModalBody>
                <Table>
                  <TableHeader>
                    <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4">Monto</TableColumn>
                    <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4">Folio</TableColumn>
                    <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4">Fecha</TableColumn>
                    <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4 text-transparent" align="center">.</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent={"No hay pagos registrados."}>
                    <TableRow>
                      <TableCell>{pago.cantidad}</TableCell>
                      <TableCell>{pago.folio}</TableCell>
                      <TableCell>{pago.fecha}</TableCell>
                      <TableCell>
                        <Tooltip content="Eliminar">
                          <Button
                            color="danger"
                            isIconOnly
                            size="sm"
                            onPress={handleEliminar}
                          >
                            <Image src={deleteIcon} alt="Eliminar" width={20} />
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose} className="bg-verde">Cerrar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ConfirmarEliminar
        isOpen={isDelOpen}
        onOpenChange={onDelOpenChange}
        pago={pago}
        fetchPagos={fetchPagos}
        handleClose={handleClose}
      />
    </>
  );
}

export default ConsultaInscripcion;
