"use client";
import { Button, Spinner, Tooltip, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmarEliminarActividad from "./confirmarEliminar";
import AgregarActividad from "./agregarActividad";
import ModActividad from "./modActividad";
import ConsultaEspecificaAct from "./consultaEspecificaActividad";
import MainLayout from "../Layout/MainLayout";
import { FaCut, FaRegEdit } from "react-icons/fa";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { CgDetailsMore } from "react-icons/cg";
import { MdOutlineDelete } from "react-icons/md";
import Actividades from "@/app/actividades/page";
import FiltroActividades from "./filtroActividades";

function ConsultaActividades() {
  const [cargando, setCargando] = useState(true);
  const [actividades, setActividades] = useState([]);
  const [selectedActividad, setSelectedActividad] = useState();
  const [searchText, setSearchText] = useState("");
  const [grupos, setGrupos] = useState([]);

  const {
    onOpen: onElOpen,
    onOpenChange: onElOpenChange,
    isOpen: isElOpen,
  } = useDisclosure();

  const {
    onOpen: onRegOpen,
    onOpenChange: onRegOpenChange,
    isOpen: isRegOpen,
  } = useDisclosure();

  const {
    onOpen: onGestOpen,
    onOpenChange: onGestOpenChange,
    isOpen: isGestOpen,
  } = useDisclosure();

  const {
    onOpen: onDetOpen,
    onOpenChange: onDetOpenChange,
    isOpen: isDetOpen,
  } = useDisclosure();

  useEffect(() => {
    fetchActividades();
    fetchGrupos();
  }, []);

  const handleGestionar = (actividad: any) => {
    setSelectedActividad(actividad);
    onGestOpen();
  };

  const handleDetalles = (actividad: any) => {
    setSelectedActividad(actividad);
    onDetOpen();
  };

  const fetchGrupos = async () => {
    try {
      const response = await axios.get("/api/grupos");
      if (response.status >= 200 && response.status < 300) {
        setGrupos(response.data);
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (e.response) {
        const s = e.response.status;
        if (s === 404 || s === 500 || s === 400) {
          toast.error(e.response.data.message);
        } else {
          toast.error(e.message);
        }
      } else {
        toast.error(e.message);
      }
    }
  };

  const fetchActividades = async () => {
    try {
      const response = await axios.get("/api/actividades");
      if (response.status >= 200 && response.status < 300) {
        setActividades(response.data);
        setCargando(false);
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (e.response) {
        const s = e.response.status;
        if (s === 404 || s === 500 || s === 400) {
          toast.error(e.response.data.message);
        } else {
          toast.error(e.message);
        }
      } else {
        toast.error(e.message);
      }
    }
  };

  const handleEliminar = (act: any) => {
    setSelectedActividad(act);
    onElOpen();
  };

  const handleAgregar = () => {
    onRegOpen();
  };

  const filteredActividades = actividades
    .filter((actividad: any) => {
      const nombreActividad = actividad.nombre.toLowerCase();
      return nombreActividad.includes(searchText.toLowerCase());
    })
    .sort((a: any, b: any) => {
      const nombreA = a.nombre.toLowerCase();
      const nombreB = b.nombre.toLowerCase();
      return nombreA.localeCompare(nombreB);
    });

  return (
    <MainLayout>
      <div className="flex flex-row m-4 md:px-10 md:pt-10 md:pb-4">
        <h1 className="text-4xl font-bold">Actividades</h1>
        <FiltroActividades
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <div className="ml-auto">
          <Button
            onPress={handleAgregar}
            className=" bg-verdeFuerte text-[#ffffff]"
            startContent={<FaCut />}
          >
            Registrar Actividad
          </Button>
        </div>
      </div>
      <div className="flex flex-col m-4 md:px-10">
        {cargando ? (
          <div className="flex justify-center items-center">
            <Spinner size="lg" color="warning" />
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[40rem] border-1 rounded-xl">
            <Table aria-label="Tabla actividades">
              <TableHeader>
                <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4">
                  Nombre
                </TableColumn>
                <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4">
                  Descripción
                </TableColumn>
                <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4 ">
                  <div className="flex justify-center">Acciones</div>
                </TableColumn>
              </TableHeader>
              <TableBody>
                {filteredActividades.map((act: any, index: any) => (
                  <TableRow key={index}>
                    <TableCell>
                      <p className="text-lg">{act.nombre}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-lg">{act.descripcion}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col md:flex-row justify-center items-center">
                        <Tooltip content="Detalles">
                          <Button
                            isIconOnly
                            size="md"
                            className=" bg-verde"
                            onClick={() => handleDetalles(act)}
                          >
                            <CgDetailsMore />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Gestionar">
                          <Button
                            isIconOnly
                            size="md"
                            className="bg-verdeDetails mx-0  my-2 md:mx-3 md:my-0"
                            onClick={() => handleGestionar(act)}
                          >
                            <FaRegEdit style={{ fontSize: "15px" }} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Eliminar">
                          <Button
                            isIconOnly
                            size="md"
                            className=" bg-verdeFuerte"
                            onClick={() => handleEliminar(act)}
                          >
                            <MdOutlineDelete style={{ fontSize: "15px" }} />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      <ConfirmarEliminarActividad
        isOpen={isElOpen}
        onOpenChange={onElOpenChange}
        actividad={selectedActividad}
        fetchActividades={fetchActividades}
      />
      <AgregarActividad
        isOpen={isRegOpen}
        onOpenChange={onRegOpenChange}
        fetchActividades={fetchActividades}
      />
      <ModActividad
        actividad={selectedActividad}
        fetchActividades={fetchActividades}
        isOpen={isGestOpen}
        onOpenChange={onGestOpenChange}
      />
      <ConsultaEspecificaAct
        actividad={selectedActividad}
        isOpen={isDetOpen}
        onOpenChange={onDetOpenChange}
      />
    </MainLayout>
  );
}

export default ConsultaActividades;
