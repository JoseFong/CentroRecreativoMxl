import React, { useEffect, useState } from "react";
import RegistrarAlumno from "./registrarAlumno";
import { Button, Spinner, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";
import ConsultaEspecificaAlumno from "./consultaEspecifica";
import ConfirmarEliminarAlumno from "./confirmarEliminarAlumno";
import NavBar from "../Layout/NavBar"
import MainLayout from "../Layout/MainLayout";

function ConsultaAlumnos() {
  //useState para guardar a los alumnos registrados
  const [alumnos, setAlumnos] = useState([]);

  //useState para determinar si la página sigue cargando
  const [cargando, setCargando] = useState(true);

  //useState para guardar las neurodivergencias
  const [nees, setNees] = useState([]);

  ///useState para guardar al alumno al cual se va a modificar o consultar de forma espeçifica
  const [alumno, setAlumno] = useState();

  //Variables para controlar el modal de registrar alumno
  const {
    onOpen: onRegistarOpen,
    isOpen: isRegistrarOpen,
    onOpenChange: onRegistarOpenChange,
  } = useDisclosure();

  //Variables para controlar el modal de consulta específica de un alumno
  const {
    onOpen: onDetallesOpen,
    isOpen: isDetallesOpen,
    onOpenChange: onDetallesOpenChange,
  } = useDisclosure();

  //Variables para controlar el modal de confirmación de eliminación de un alumno
  const {
    onOpen: onEliminarOpen,
    isOpen: isEliminarOpen,
    onOpenChange: onEliminarOpenChange,
  } = useDisclosure();

  //Cuando esta página se cargue se llamaran las siguientes dos funciones:
  useEffect(() => {
    fetchAlumnos();
    fetchNees();
  }, []);

  //fetchAlumnos consigue a todos los alumnos de la bd
  const fetchAlumnos = async () => {
    try {
      const response = await axios.get("/api/alumnos"); //fetch a la api de alumnos
      if (response.status >= 200 && response.status < 300) {
        //si el status es exitoso se guardan los alumnos y se declara cargando como false
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

  //fetchNees consigue todas las neurodivergencias registradas en la BD
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

  /**
   * Función para abrir el modal de consulta específica de un alumno
   * @param alumno alumno del cual se verán los detalles
   */
  const handleVerDetalles = (alumno: any) => {
    setAlumno(alumno);
    onDetallesOpen();
  };

  /**
   * Función para abrir el modal de confirmación de eliminación de un alumno
   * @param alumno alumno que se va a eliminar
   */
  const handleEliminar = (alumno: any) => {
    setAlumno(alumno);
    onEliminarOpen();
  };

  //Contenido de la página
  return (
    <MainLayout>
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

    </MainLayout>
  );
}

export default ConsultaAlumnos;
