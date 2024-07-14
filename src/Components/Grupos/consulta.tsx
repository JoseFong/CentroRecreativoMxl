import axios from "axios";
import toast from "react-hot-toast";
import { button, Button, Spinner, useDisclosure } from "@nextui-org/react";
import MainLayout from "@/Components/Layout/MainLayout";
import { SetStateAction, useEffect, useState } from "react";
import RegistrarGrupo from "@/Components/Grupos/registrarGrupo";
import ConsultaEspecificaGrupo from "@/Components/Grupos/consultaEspecifica";
import ModificarGrupo from "@/Components/Grupos/modificarGrupo";
import ImprimirGrupo from "./imprimirGrupo";
import { FaUserEdit } from "react-icons/fa";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  CardHeader,
  Tooltip,
} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { FaPrint } from "react-icons/fa6";

function ConsultaGrupos() {
  const [grupos, setGrupos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [selectedDocente, setSelectedDocente] = useState(null);
  const [selectedAlumnos, setSelectedAlumnos] = useState([]);
  const [alumnosGrupo, setAlumnosGrupo] = useState([]);
  const [grupoImprimir, setGrupoImprimir] = useState([]);

  //Variables para manejar el modal de registro de grupo
  const {
    onOpen: onRegistarOpen,
    isOpen: isRegistrarOpen,
    onOpenChange: onRegistarOpenChange,
  } = useDisclosure();

  // Estado para manejar el grupo seleccionado
  const {
    onOpen: onConsultaEspecificaOpen,
    isOpen: isConsultaEspecificaOpen,
    onOpenChange: onConsultaEspecificaOpenChange,
  } = useDisclosure();

  // Estado para manejar modificar un grupo
  const {
    onOpen: onModificarOpen,
    isOpen: isModificarOpen,
    onOpenChange: onModificarOpenChange,
  } = useDisclosure();

  // Estado para manejar la impresion de grupo
  const {
    onOpen: onOpenImprimir,
    isOpen: isOpenImprimir,
    onOpenChange: onOpenChangeImprimir,
  } = useDisclosure();

  // Función para manejar el click en un grupo

  const handleModificarGrupoClick = (
    grupo: React.SetStateAction<null>,
    docente: any,
    alumnos: SetStateAction<never[]>
  ) => {
    setSelectedGrupo(grupo);
    setSelectedDocente(docente);
    setSelectedAlumnos(alumnos);
    onModificarOpen();
  };

  //Traer la informacion de todos los grupos
  useEffect(() => {
    fetchGrupos();
    fetchDocentes();
    fetchAlumnos();
  }, []);

  // Función para obtener los grupos desde la API
  const fetchGrupos = async () => {
    try {
      const response = await axios.get("/api/grupos");
      if (response.status >= 200 && response.status < 300) {
        setGrupos(response.data);
        setCargando(false);
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

  // Función para obtener los docentes desde la API
  const fetchDocentes = async () => {
    try {
      const response = await axios.get("/api/docentes");
      if (response.status >= 200 && response.status < 300) {
        setDocentes(response.data);
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

  // Función para obtener los alumnos desde la API
  const fetchAlumnos = async () => {
    try {
      const response = await axios.get("/api/alumnos");
      if (response.status >= 200 && response.status < 300) {
        setAlumnos(response.data);
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

  // Función para obtener los docentes por grupo
  const docentesPorGrupo = (grupoId: number) => {
    const grupo: any = grupos.find((g: any) => g.id === grupoId);
    if (grupo) {
      return docentes.find((d: any) => d.id === grupo.docenteId);
    }
    return null;
  };

  // Función para obtener los alumnos por grupo
  const alumnosPorGrupo = (grupoId: number) => {
    return alumnos.filter((a: any) => a.grupoId === grupoId);
  };

  const imprimir = (grupo: any) => {
    setGrupoImprimir(grupo);
    setAlumnosGrupo(alumnosPorGrupo(grupo.id));
    onOpenImprimir();
  };

  return (
    <MainLayout>
      <div>
        <div className="flex flex-col md:flex-row m-4 md:px-10 md:pt-10 md:pb-4">
          <div className=" flex flex-col md:flex-row">
            <h1 className=" text-4xl font-bold">Grupos</h1>
          </div>
          <Button
            color="success"
            onClick={onRegistarOpen}
            className=" md:ml-auto bg-verdeFuerte text-[#ffffff] mt-3"
            startContent={<FaUserEdit />}
          >
            Registrar Grupo
          </Button>
        </div>
        <div className="flex flex-col m-4 md:px-10">
          {cargando ? (
            <>
              <div className="flex justify-center items-center">
                <Spinner size="lg" color="warning" />
              </div>
            </>
          ) : (
            <div className="flex w-full flex-col">
              <Tabs aria-label="Dynamic tabs">
                {grupos.map((g: any) => {
                  const docente = docentesPorGrupo(g.id);
                  const alumnos = alumnosPorGrupo(g.id);
                  return (
                    <Tab key={g.id} title={`Grupo: ${g.nombre}`}>
                      <Card
                        className="w-full"
                        isPressable
                        onPress={() =>
                          handleModificarGrupoClick(g, docente, alumnos)
                        }
                      >
                        <CardBody>
                          <div className="p-2 flex flex-col w-full">
                            <div className="flex justify-between items-center">
                              <h1 className="font-bold">Grupo: {g.nombre}</h1>
                              <Button isIconOnly onPress={() => imprimir(g)}>
                                <FaPrint />
                              </Button>
                            </div>
                            <h1 className="font-bold pb-2">
                              Docente Encargado:{" "}
                              {docente && docente.nombre
                                ? docente.nombre + " " + docente.aPaterno
                                : "Sin docente asignado"}
                            </h1>
                            <h1 className="font-bold">
                              Salida(s): Sin salidas
                            </h1>
                          </div>
                          <div className="overflow-y-auto max-h-[32rem]">
                            <Table aria-label="Example static collection table">
                              <TableHeader>
                                <TableColumn className="bg-headerNav text-[#ffffff] text-sm md:text-md font-bold">
                                  Nombre(s)
                                </TableColumn>
                                <TableColumn className="bg-headerNav text-[#ffffff] text-sm md:text-md font-bold">
                                  Apellido Paterno
                                </TableColumn>
                                <TableColumn className="bg-headerNav text-[#ffffff] text-sm md:text-md font-bold">
                                  Apellido Materno
                                </TableColumn>
                              </TableHeader>
                              <TableBody>
                                {alumnos.map((alumno: any, index: any) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      <p className="text-xs md:text-xl">
                                        {alumno.nombre.toUpperCase()}
                                      </p>
                                    </TableCell>
                                    <TableCell>
                                      <p className="text-xs md:text-xl">
                                        {alumno.aPaterno.toUpperCase()}
                                      </p>
                                    </TableCell>
                                    <TableCell>
                                      <p
                                        className={` text-xs md:text-xl ${
                                          !alumno.aMaterno ? "font-bold" : ""
                                        }`}
                                      >
                                        {alumno.aMaterno
                                          ? alumno.aMaterno.toUpperCase()
                                          : "No registrado"}
                                      </p>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </CardBody>
                      </Card>
                    </Tab>
                  );
                })}
              </Tabs>
            </div>
          )}
        </div>
        <RegistrarGrupo
          isOpen={isRegistrarOpen}
          onOpenChange={onRegistarOpenChange}
          fetchGrupos={fetchGrupos}
          fetchAlumnos={fetchAlumnos}
          docentes={docentes}
          grupos={grupos}
          alumnos={alumnos}
          selectedAlumnos={selectedAlumnos}
          selectedDocente={selectedDocente}
        />
        <ConsultaEspecificaGrupo
          isOpen={isConsultaEspecificaOpen}
          onOpenChange={onConsultaEspecificaOpenChange}
          grupo={selectedGrupo}
          docente={selectedDocente}
          alumnos={selectedAlumnos}
        />
        <ModificarGrupo
          selectedGrupo={selectedGrupo}
          selectedDocente={selectedDocente}
          selectedAlumnos={selectedAlumnos}
          isOpen={isModificarOpen}
          onOpenChange={onModificarOpenChange}
          docentes={docentes}
          grupos={grupos}
          alumnos={alumnos}
          fetchGrupos={fetchGrupos}
          fetchAlumnos={fetchAlumnos}
        />
        <ImprimirGrupo
          grupo={grupoImprimir}
          alumnos={alumnosGrupo}
          isOpen={isOpenImprimir}
          onOpenChange={onOpenChangeImprimir}
          onOpen={onOpenImprimir}
        />
      </div>
    </MainLayout>
  );
}

export default ConsultaGrupos;
