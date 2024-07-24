import { Button, Card, CardBody, Spinner, Tab, Tabs, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmarEliminarActividad from "./confirmarEliminar";
import AgregarActividad from "./agregarActividad";
import ModActividad from "./modActividad";
import ConsultaEspecificaAct from "./consultaEspecificaActividad";
import MainLayout from "../Layout/MainLayout";
import { FaCut } from "react-icons/fa";

function ConsultaActividades() {
  const [cargando, setCargando] = useState(true);
  const [actividades, setActividades] = useState([]);
  const [selectedActividad, setSelectedActividad] = useState();
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

  return (
    <MainLayout>
      <div className="flex flex-row m-4 md:px-10 md:pt-10 md:pb-4">
        <h1 className="text-4xl font-bold">Actividades</h1>
        <div className="ml-auto">
          <Button onPress={handleAgregar} className=" bg-verdeFuerte text-[#ffffff]" startContent={<FaCut />}>Registrar Actividad</Button>
        </div>
      </div>
      <div className="flex flex-col m-4 md:px-10">
        {cargando ? (
            <div className="flex justify-center items-center">
              <Spinner size="lg" color="warning"/>
            </div>
        ) : (
          <div className="flex w-full flex-col">
            <Tabs aria-label="Dynamic tabs">
              {grupos.map((g: any) => {
                return (
                  <Tab key={g.id} title={`Grupo: ${g.nombre}`}>
                    <Card className="w-full">
                      <CardBody>
                        <div className="p-2 flex flex-col w-full">
                          
                        </div>
                      </CardBody>
                    </Card>
                  </Tab>
                )
              })}
            </Tabs>
           
           
           
           
            {actividades.map((act: any) => (
              <div>
                {act.nombre} {act.descripcion}
                <Button color="danger" onPress={() => handleEliminar(act)}>
                  Eliminar
                </Button>
                <Button onPress={() => handleGestionar(act)}>Gestionar</Button>
                <Button onPress={() => handleDetalles(act)}>Ver detalles</Button>
              </div>
            ))}
          </div>
        )}



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
        
      </div>
    </MainLayout>
  );
}

export default ConsultaActividades;
