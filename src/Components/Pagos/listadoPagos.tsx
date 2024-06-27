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
import React, { useEffect, useState } from "react";
import { Pago } from "@prisma/client";
import Image from "next/image";
import deleteIcon from "@/Assets/deleteIcon.png";
import ConfirmarEliminar from "./confirmarEliminar";

function ListadoPagos({
  isOpen,
  onOpenChange,
  tipo,
  alumno,
  pagos,
  fetchPagos,
}: {
  isOpen: any;
  onOpenChange: any;
  tipo: any;
  alumno: any;
  pagos: Pago[];
  fetchPagos: () => void;
}) {
  return (
    <>
      {pagos && (
        <Listado
          pagos={pagos}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          tipo={tipo}
          alumno={alumno}
          fetchPagos={fetchPagos}
        />
      )}
    </>
  );
}

function Listado({
  isOpen,
  onOpenChange,
  tipo,
  alumno,
  pagos,
  fetchPagos,
}: {
  isOpen: any;
  onOpenChange: any;
  tipo: any;
  alumno: any;
  pagos: Pago[];
  fetchPagos: () => void;
}) {
  const {
    isOpen: isDelOpen,
    onOpen: onDelOpen,
    onOpenChange: onDelOpenChange,
  } = useDisclosure();
  const [selectedPago, setSelectedPago] = useState();

  const handleEliminar = (pago: any) => {
    setSelectedPago(pago);
    onDelOpen();
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {tipo} de {alumno}
              </ModalHeader>
              <ModalBody>
                <Table>
                  <TableHeader>
                    <TableColumn>Monto</TableColumn>
                    <TableColumn>Folio</TableColumn>
                    <TableColumn>Fecha</TableColumn>
                    <TableColumn>Descripción</TableColumn>
                    <TableColumn>.</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {pagos.map((pag: Pago) => (
                      <TableRow>
                        <TableCell>{pag.cantidad}</TableCell>
                        <TableCell>{pag.folio}</TableCell>
                        <TableCell>{pag.fecha}</TableCell>
                        <TableCell>{pag.descripcion}</TableCell>
                        <TableCell>
                          <Tooltip content="Eliminar">
                            <Button
                              color="danger"
                              isIconOnly
                              size="sm"
                              onPress={() => handleEliminar(pag)}
                            >
                              <Image
                                src={deleteIcon}
                                alt="Eliminar"
                                width={20}
                              />
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Cerrar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ConfirmarEliminar
        isOpen={isDelOpen}
        onOpenChange={onDelOpenChange}
        pago={selectedPago}
        fetchPagos={fetchPagos}
        handleClose={handleClose}
      />
    </>
  );
}

export default ListadoPagos;
