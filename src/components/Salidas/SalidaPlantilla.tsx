import React from "react";
import { Button, Divider, Tooltip, useDisclosure } from "@nextui-org/react";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import ConfirmarEliminarSalida from "./confirmarEliminarSalida";
import EditarSalida from "./EditarSalida";
import { Accordion, AccordionItem } from "@nextui-org/react";

function SalidaPlantilla({ salida, index, refetch, docentes, grupos }: any) {
  const {
    isOpen: isOpenEliminar,
    onOpen: onOpenEliminar,
    onOpenChange: onChangeEliminar,
  } = useDisclosure();

  const {
    isOpen: isOpenModificar,
    onOpen: onOpenModificar,
    onOpenChange: onChangeModificar,
  } = useDisclosure();

  const docenteEncargado = docentes.find(
    (docente: any) => docente.id === salida.docenteId
  );

  const grupoAsignado = grupos.find(
    (grupo: any) => grupo.id === salida.grupoId
  );

  return (
    <>
      <Accordion isCompact>
        <AccordionItem
          key="1"
          aria-label={salida.nombre}
          title={salida.nombre}
          className="mb-2 rounded-md text-[#000000]"
        >
          <Button
            className="text-[#000000] flex flex-row mb-1 p-2 bg-slate-200 rounded-md h-auto w-full"
            key={index}
            onClick={onOpenModificar}
            role="button"
          >
            <div className="flex flex-col place-items-start overflow-y-auto">
              <span className=" font-bold">Nombre:</span> {salida.nombre}
              <span className=" font-bold">Fecha:</span> {salida.fecha}
              <span className=" font-bold">Hora de salida:</span>{" "}
              {salida.horaDeSalida}
              <span className=" font-bold"> Docente encargado:</span>{" "}
              {docenteEncargado ? docenteEncargado.nombre : "No asignado"}
              <span className=" font-bold"> Grupo asignado:</span>{" "}
              {grupoAsignado ? grupoAsignado.nombre : "No asignado"}
            </div>
            <div className="flex flex-col ml-auto">
              <Tooltip content="Eliminar">
                <Button
                  isIconOnly
                  className=" w-4 h-8 bg-verdeFuerte"
                  onPress={onOpenEliminar}
                >
                  {" "}
                  <MdOutlineDelete />
                </Button>
              </Tooltip>
            </div>
          </Button>
        </AccordionItem>
      </Accordion>
      <Divider />
      <ConfirmarEliminarSalida
        isOpen={isOpenEliminar}
        onOpen={onOpenEliminar}
        onOpenChange={onChangeEliminar}
        salida={salida}
        refetch={refetch}
      />
      <EditarSalida
        isOpen={isOpenModificar}
        onOpen={onOpenModificar}
        onOpenChange={onChangeModificar}
        docentes={docentes}
        grupos={grupos}
        salida={salida}
        refetch={refetch}
      />
    </>
  );
}

export default SalidaPlantilla;
