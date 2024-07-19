import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import { FaCarSide } from "react-icons/fa6";
import RegistrarSalida from "./registrarSalida";
import SalidaPlantilla from "./SalidaPlantilla";

interface ConsultaSalidasProps {
  docentes?: any[];
  grupos?: any[];
  salidasRegistradas?: any[];
  refetch?: any;
}

export default function App({
  docentes,
  grupos,
  salidasRegistradas,
  refetch,
}: ConsultaSalidasProps) {
  const [salidas, setSalidas] = useState<any[]>([]);

  useEffect(() => {
    if (salidasRegistradas) {
      setSalidas(salidasRegistradas);
    }
  }, [salidasRegistradas]);

  return (
    <div>
      <Popover placement="bottom">
        <PopoverTrigger>
          <Button isIconOnly className="bg-verdeFuerte text-[#ffffff]">
            <FaCarSide />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className=" font-bold py-2">Gestionar salidas</div>
          <div className=" overflow-auto h-56 rounded-xl pt-2 bg-slate-100 w-full">
            {salidas.length === 0 ? (
              <p>No hay salidas disponibles.</p>
            ) : (
              salidas.map((salida: any, index) => (
                <SalidaPlantilla
                  key={index}
                  salida={salida}
                  index={index}
                  docentes={docentes}
                  grupos={grupos}
                  refetch={refetch}
                />
              ))
            )}
          </div>
          <div className=" my-2">
            <RegistrarSalida
              esRegistro={true}
              docentes={docentes}
              grupos={grupos}
              refetch={refetch}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
