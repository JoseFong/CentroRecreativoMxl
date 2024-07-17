import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { FaCarSide } from "react-icons/fa6";
import RegistrarSalida from "./registrarSalida";
import axios from "axios";
import toast from "react-hot-toast";
import SalidaPlantilla from "./SalidaPlantilla";

export default function App() {
  const [salidas, setSalidas] = useState([
    {
      nombre: "Sol del nino",
      fecha: "2024-08-02",
      docente: "Josue",
      grupo: "Grupo A",
    },
    {
      nombre: "Starbucks",
      fecha: "2024-08-02",
      docente: "Josue",
      grupo: "Grupo A",
    },
    {
      nombre: "Alemania",
      fecha: "2024-08-02",
      docente: "Josue",
      grupo: "Grupo A",
    },
  ]);

  /**const fetchSalidas = async () => {
    try {
      const response = await axios.get("/api/salidas/");
      if (response.status >= 200 && response.status < 300) {
        setSalidas(response.data);
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (e.response?.status === 404 || e.response?.status === 500) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  };**/

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
          <div className=" overflow-auto h-56 rounded-xl p-2 bg-slate-100 w-full">
            {salidas.length === 0 ? (
              <p>No hay neurodivergencias disponibles.</p>
            ) : (
              salidas.map((salida, index) => (
                <SalidaPlantilla
                  key={index}
                  nombre={salida.nombre}
                  index={index}
                />
              ))
            )}
          </div>
          <div className=" my-2">
            <RegistrarSalida esRegistro={true} />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
