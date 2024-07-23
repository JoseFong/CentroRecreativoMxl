import { Button, Spinner, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmarEliminarActividad from "./confirmarEliminar";
import AgregarActividad from "./agregarActividad";
import ModActividad from "./modActividad";
import ConsultaEspecificaAct from "./consultaEspecificaActividad";

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
    <>
      <h1>Actividades</h1>
      <Button onPress={handleAgregar}>Agregar</Button>
      {cargando ? (
        <Spinner size="lg" />
      ) : (
        <>
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
        </>
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
    </>
  );
}

export default ConsultaActividades;
