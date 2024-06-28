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
import './scrollbar.css'

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
                <Table aria-label="Tabla de listado de pagos" isHeaderSticky className="max-h-[400px] overflow-y-auto p-1"> 
                  <TableHeader>
                    <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4">Monto</TableColumn>
                    <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4">Folio</TableColumn>
                    <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4">Fecha</TableColumn>
                    <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4">Descripción</TableColumn>
                    <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4 text-transparent" align="center">.</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent={"No hay pagos registrados."}>
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
                <Button onPress={onClose} className="bg-verde">Cerrar</Button>
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
