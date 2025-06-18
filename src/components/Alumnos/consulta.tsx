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
import Neurodivergencias from "@/components/Alumnos/neurodivergencias";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import FiltroAlumnos from "./FiltroAlumnos";

function ConsultaAlumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nees, setNees] = useState([]);
  const [alumno, setAlumno] = useState();
  const [searchText, setSearchText] = useState("");
  const [grupos, setGrupos] = useState([]);

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

  const {
    onOpen: onModOpen,
    onOpenChange: onModOpenChange,
    isOpen: isModOpen,
  } = useDisclosure();

  useEffect(() => {
    fetchAlumnos();
    fetchNees();
    fetchGrupos();
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
        if (
          e.response.status === 404 ||
          e.response.status === 500 ||
          e.response.status === 400
        ) {
          toast.error(e.response.data.message);
        } else {
          toast.error(e.message);
        }
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

  const handleEditar = (al: any) => {
    setAlumno(al);
    onModOpen();
  };

  const obtenerNombreGrupo = (id: number) => {
    const grupo = grupos.find((gr: any) => gr.id === id);
    // @ts-ignore
    if (grupo) return grupo.nombre;
    return null;
  };

  const filteredAlumnos = alumnos
    .filter((alumno: any) => {
      const nombreCompleto = `${alumno.nombre} ${alumno.aPaterno} ${
        alumno.aMaterno || ""
      }`.toLowerCase();
      return nombreCompleto.includes(searchText.toLowerCase());
    })
    .sort((a: any, b: any) => {
      const nombreA = `${a.nombre} ${a.aPaterno} ${
        a.aMaterno || ""
      }`.toLowerCase();
      const nombreB = `${b.nombre} ${b.aPaterno} ${
        b.aMaterno || ""
      }`.toLowerCase();
      return nombreA.localeCompare(nombreB);
    });

  return (
    <MainLayout>
      <div>
        <div className="flex flex-row m-4 md:px-10 md:pt-10 md:pb-4">
          <div className="flex flex-col md:flex-row">
            <h1 className="text-4xl font-bold">Alumnos</h1>
            <FiltroAlumnos
              searchText={searchText}
              setSearchText={setSearchText}
            />
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
              <div className=" pt-4 md:pt-0 hidden md:block">
                <Neurodivergencias fetchAlumnos={fetchAlumnos} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col m-4 md:px-10">
          {cargando ? (
            <div className="flex justify-center items-center">
              <Spinner size="lg" color="warning" />
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[40rem] border-1 rounded-xl">
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
                  {filteredAlumnos.map((alumno: any, index: any) => (
                    <TableRow key={index}>
                      <TableCell>
                        <p className=" text-lg">
                          {`${alumno.nombre} ${alumno.aPaterno} ${
                            alumno.aMaterno ? alumno.aMaterno : ""
                          }`}
                        </p>
                      </TableCell>
                      <TableCell>
                        {alumno.grupoId ? (
                          <p className=" text-lg">
                            {obtenerNombreGrupo(alumno.grupoId)}
                          </p>
                        ) : (
                          <p className="text-lg">Sin grupo</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className=" text-lg">{`${alumno.telefono}`}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col md:flex-row justify-center items-center">
                          <Tooltip content="Detalles">
                            <Button
                              isIconOnly
                              size="md"
                              className=" bg-verde"
                              onClick={() => handleVerDetalles(alumno)}
                            >
                              <CgDetailsMore />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Editar">
                            <Button
                              isIconOnly
                              size="md"
                              className="bg-verdeDetails mx-0  my-2 md:mx-3 md:my-0"
                              onClick={() => handleEditar(alumno)}
                            >
                              <FaRegEdit style={{ fontSize: "15px" }} />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Eliminar">
                            <Button
                              isIconOnly
                              size="md"
                              className=" bg-verdeFuerte"
                              onClick={() => handleEliminar(alumno)}
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
        <RegistrarAlumno
          isOpen={isRegistrarOpen}
          onOpenChange={onRegistarOpenChange}
          nees={nees}
          fetchAlumnos={fetchAlumnos}
          grupos={grupos}
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
          grupos={grupos}
          fetchNees={fetchNees}
        />
      </div>
    </MainLayout>
  );
}

export default ConsultaAlumnos;
