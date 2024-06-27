import React from "react";
import { Button } from "@nextui-org/react";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { Tooltip } from "@nextui-org/react";

const neurodivergenciaPlantilla = ({
  neurodivergencia,
  handleModificar,
  handleEliminar,
  key,
}: any) => {
  return (
    <div className="text-[#ffffff] flex flex-row mb-1 p-2 items-center bg-verdeFuerte rounded-md" key={key}>
      {neurodivergencia.nombre}
      <div className="flex flex-row ml-auto">
        <Tooltip content="Editar">
        <Button
          isIconOnly
          className=" w-auto h-4 bg-verdeDetails mx-2"
          variant="light"
          onClick={() => handleModificar(neurodivergencia)}
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
          onClick={() => handleEliminar(neurodivergencia)}
        >
          {" "}
          <MdOutlineDelete />
        </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default neurodivergenciaPlantilla;
