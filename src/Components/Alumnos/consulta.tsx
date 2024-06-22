import React, { useEffect, useState } from "react";
import RegistrarAlumno from "./registrarAlumno";
import { Button, Spinner, useDisclosure, Tooltip } from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";
import ConsultaEspecificaAlumno from "./consultaEspecifica";
import ConfirmarEliminarAlumno from "./confirmarEliminarAlumno";
import { FaRegEdit } from "react-icons/fa";
import MainLayout from "../Layout/MainLayout";
import ModificarAlumno from "./modificarAlumno";
import { MdOutlineDelete } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import { Input } from "@nextui-org/input";
import { CiSearch } from "react-icons/ci";
import Neurodivergencias from "@/Components/Alumnos/neurodivergencias";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

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

  const {
    onOpen: onModOpen,
    onOpenChange: onModOpenChange,
    isOpen: isModOpen,
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

  const handleEditar = (al: any) => {
    setAlumno(al);
    onModOpen();
  };

  //Contenido de la página
  return (
    <MainLayout>
      <div>
        <div className="flex flex-row m-4 md:px-10 md:py-10">
          <div className="flex flex-col md:flex-row">
            <h1 className="text-4xl font-bold">Alumnos</h1>
            <Input
              startContent={<CiSearch />}
              className="ml-0 mt-4 md:ml-10 md:mt-0"
              variant="bordered"
              placeholder="Filtrar alumnos"
            >
              a
            </Input>
          </div>
          <div className=" ml-auto">
            <div className="flex flex-col md:flex-row items-center ">
              <Button
                onPress={onRegistarOpen}
                className=" bg-verdeFuerte text-[#ffffff]"
                startContent={<FaUserEdit />}
              >
                Registrar Alumno
              </Button>
              <p className="text-lg px-4 hidden md:block">|</p>
              <div className=" pt-4 md:pt-0">
              <Tooltip content="Gestionar ND">
              <Neurodivergencias/>
              </Tooltip>
              </div>
            </div>
          </div>
        </div>
        <div>
          {cargando ? (
            <>
              <Spinner size="lg" />
            </>
          ) : (
            <div>
              <Table aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4">
                    Alumno
                  </TableColumn>
                  <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4">
                    Grupo
                  </TableColumn>
                  <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4">
                    Teléfono
                  </TableColumn>
                  <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4 ">
                    <div className="flex justify-center">Acciones</div>
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {alumnos.map((alumno: any, index: any) => (
                    <TableRow key={index}>
                      <TableCell>
                        <p className=" text-lg">
                          {" "}
                          {`${alumno.nombre} ${alumno.aPaterno} ${
                            alumno.aMaterno ? alumno.aMaterno : ""
                          }`}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className=" text-lg">{`${alumno.grupoId}`}</p>
                      </TableCell>
                      <TableCell>
                        <p className=" text-lg">{`${alumno.telefono}`}</p>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col md:flex-row justify-center items-center">
                          <Button
                            isIconOnly
                            size="md"
                            className=" bg-verde"
                            onClick={() => handleVerDetalles(alumno)}
                          >
                            <CgDetailsMore />
                          </Button>
                          <Button
                            isIconOnly
                            size="md"
                            className="bg-verdeDetails mx-0  my-2 md:mx-3 md:my-0"
                            onClick={() => handleEditar(alumno)}
                          >
                            <FaRegEdit style={{ fontSize: "15px" }} />
                          </Button>

                          <Button
                            isIconOnly
                            size="md"
                            className=" bg-verdeFuerte"
                            onClick={() => handleEliminar(alumno)}
                          >
                            <MdOutlineDelete style={{ fontSize: "15px" }} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
        <ModificarAlumno
          alumno={alumno}
          onOpenChange={onModOpenChange}
          isOpen={isModOpen}
          nees={nees}
          fetchAlumnos={fetchAlumnos}
        />
      </div>
    </MainLayout>
  );
}

export default ConsultaAlumnos;
