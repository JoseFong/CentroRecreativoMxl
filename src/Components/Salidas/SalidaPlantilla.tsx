import React, { useEffect } from "react";
import { Button, Tooltip, useDisclosure } from "@nextui-org/react";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import ConfirmarEliminarSalida from "./confirmarEliminarSalida";
import EditarSalida from "./EditarSalida";

function SalidaPlantilla({ nombre, index, setIsOpen }: any) {
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

  return (
    <>
      <div
        className="text-[#ffffff] flex flex-row mb-1 p-2 items-center bg-verdeFuerte rounded-md"
        key={index}
      >
        {nombre}
        <div className="flex flex-row ml-auto">
          <Tooltip content="Editar">
            <Button
              isIconOnly
              className=" w-auto h-4 bg-verdeDetails mx-2"
              variant="light"
              onPress={onOpenModificar}
            >
              {" "}
              <FaRegEdit />
            </Button>
          </Tooltip>
          <Tooltip content="Eliminar">
            <Button
              isIconOnly
              className=" w-auto h-4 bg-verde"
              variant="light"
              onPress={onOpenEliminar}
            >
              {" "}
              <MdOutlineDelete />
            </Button>
          </Tooltip>
        </div>
      </div>
      <ConfirmarEliminarSalida
        isOpen={isOpenEliminar}
        onOpen={onOpenEliminar}
        onOpenChange={onChangeEliminar}
        nombre={nombre}
      />
      <EditarSalida
        isOpen={isOpenModificar}
        onOpen={onOpenModificar}
        onOpenChange={onChangeModificar}
      />
    </>
  );
}

export default SalidaPlantilla;
