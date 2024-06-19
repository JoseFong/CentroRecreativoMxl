import React, { useEffect, useState } from "react";
import RegistrarAlumno from "./registrarAlumno";
import { Button, Spinner, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";
import ConsultaEspecificaAlumno from "./consultaEspecifica";
import ConfirmarEliminarAlumno from "./confirmarEliminarAlumno";

interface NEE {
  nombre: string;
  id: number;
}

function ConsultaAlumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nees, setNees] = useState([]);
  const [alumno, setAlumno] = useState();
  const [neeAlumno, setNeeAlumno] = useState();

  const {
    onOpen: onRegistarOpen,
    isOpen: isRegistrarOpen,
    onOpenChange: onRegistarOpenChange,
  } = useDisclosure();

  const {
    onOpen: onDetallesOpen,
    isOpen: isDetallesOpen,
    onOpenChange: onDetallesOpenChange,
  } = useDisclosure();

  const {
    onOpen: onEliminarOpen,
    isOpen: isEliminarOpen,
    onOpenChange: onEliminarOpenChange,
  } = useDisclosure();

  useEffect(() => {
    fetchAlumnos();
    fetchNees();
  }, []);

  const fetchAlumnos = async () => {
    try {
      const response = await axios.get("/api/alumnos");
      if (response.status >= 200 && response.status < 300) {
        setAlumnos(response.data);
        setCargando(false);
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (e.respone.status === 404 || e.response.status === 500) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  };

  const fetchNees = async () => {
    try {
      const response = await axios.get("/api/nee");
      if (response.status >= 200 && response.status < 300) {
        setNees(response.data);
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (e.response.status === 404 || e.response.status === 500) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  };

  const handleVerDetalles = (alumno: any) => {
    setAlumno(alumno);
    onDetallesOpen();
  };

  const handleEliminar = (alumno: any) => {
    setAlumno(alumno);
    onEliminarOpen();
  };

  return (
    <div>
      <h1>Alumnos</h1>
      <Button onPress={onRegistarOpen}>Registrar Alumno</Button>
      <div>
        {cargando ? (
          <>
            <Spinner size="lg" />
          </>
        ) : (
          <div className="flex flex-col">
            {alumnos.map((al: any) => (
              <div className="flex flex-row gap-3">
                {al.nombre} {al.aPaterno} {al.aMaterno} {al.fechaNac}{" "}
                {al.telefono}
                <button
                  className="text-blue-800 underline"
                  onClick={() => handleVerDetalles(al)}
                >
                  Ver detalles
                </button>
                <button
                  className="text-blue-800 underline"
                  onClick={() => handleEliminar(al)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <RegistrarAlumno
        isOpen={isRegistrarOpen}
        onOpenChange={onRegistarOpenChange}
        nees={nees}
        fetchAlumnos={fetchAlumnos}
        fetchNees={fetchNees}
      />
      <ConsultaEspecificaAlumno
        isOpen={isDetallesOpen}
        onOpenChange={onDetallesOpenChange}
        alumno={alumno}
      />
      <ConfirmarEliminarAlumno
        isOpen={isEliminarOpen}
        onOpenChange={onEliminarOpenChange}
        alumno={alumno}
        fetchAlumnos={fetchAlumnos}
      />
    </div>
  );
}

export default ConsultaAlumnos;
