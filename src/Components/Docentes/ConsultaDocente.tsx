"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import MainLayout from "../Layout/MainLayout";
import {
  useDisclosure,
  Button,
  Input,
  Select,
  Spinner,
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableColumn,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import ConsultaEspecifica from "./ConsultaEspecifica";
import { CgDetailsMore } from "react-icons/cg";
import { FaUserEdit, FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import RegistrarDocente from "./registrarDocente";
import ConfirmarEliminar from "./confirmarEliminar";
import ModificarDocente from "./modificarDocente";

interface Docente {
  id?: number;
  nombre: string;
  aPaterno: string;
  aMaterno: string;
  telefono: string;
  fechaNac: string;
  curp: string;
  correo: string;
  usuario: string;
  contrasena: string;
  rol: string;
}

const ConsultaDocente = () => {
  const [docentes, setDocentes] = useState([]); // Aqui estan los docentes traidos con el fetch
  const [docente, setDocente] = useState<Docente>({
    nombre: "",
    aPaterno: "",
    aMaterno: "",
    telefono: "",
    fechaNac: "",
    curp: "",
    correo: "",
    usuario: "",
    contrasena: "",
    rol: "",
  }); //Estos son los campos que le debes mandar a la api
  const [docenteSeleccionado, setDocenteSeleccionado] = useState();
  const [cargando, setCargando] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    fetchDocentes();
    fetchGrupos();
  }, []);

  useEffect(() => {
    fetchDocentes();
    setRefetch(false);
  }, [refetch]);

  const fetchDocentes = async () => {
    try {
      const response = await axios.get("/api/docentes");
      if (response.status >= 200 && response.status < 300) {
        setDocentes(response.data);
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (
        e.response &&
        (e.response.status === 404 || e.response.status === 500)
      ) {
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

  const {
    isOpen: isOpenModificar,
    onOpen: onOpenModificar,
    onOpenChange: onOpenChangeModificar,
  } = useDisclosure();
  const {
    isOpen: isOpenEliminar,
    onOpen: onOpenEliminar,
    onOpenChange: onOpenChangeEliminar,
  } = useDisclosure();
  const {
    isOpen: isOpenRegistro,
    onOpen: onOpenRegistro,
    onOpenChange: onOpenChangeRegistro,
  } = useDisclosure();

  const {
    isOpen: isOpenDetalles,
    onOpen: onOpenDetalles,
    onOpenChange: onOpenChangeDetalles,
  } = useDisclosure();

  const handleDetalles = (docente: any) => {
    setDocenteSeleccionado(docente);
    onOpenDetalles();
  };

  const handleEliminar = (docente: any) => {
    setDocenteSeleccionado(docente);
    onOpenEliminar();
  };

  const handleModificar = (docente: any) => {
    setDocenteSeleccionado(docente);
    onOpenModificar();
  };

  function obtenerNombresGrupos(docenteId: any) {
    const nombresDeGrupos = grupos
      .filter((grupo: any) => grupo.docenteId === docenteId)
      .map((gr: any) => gr.nombre);
    const str = nombresDeGrupos.join(", ");
    if (str === "") return "Sin Grupo";
    return str;
  }

  return (
    <MainLayout>
      <div>
        <div className="flex flex-row m-4 md:px-10 md:pt-10 md:pb-4">
          <div className="flex flex-col md:flex-row">
            <h1 className="text-4xl font-bold">Docentes</h1>
          </div>
          <div className=" ml-auto">
            <div className="flex flex-col md:flex-row items-center ">
              <Button
                onPress={onOpenRegistro}
                className=" bg-verdeFuerte text-[#ffffff]"
                startContent={<FaUserEdit />}
              >
                Registrar docente
              </Button>
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
                    Docente
                  </TableColumn>
                  <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4">
                    Grupo(s)
                  </TableColumn>
                  <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4">
                    Teléfono
                  </TableColumn>
                  <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4 ">
                    <div className="flex justify-center">Acciones</div>
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {docentes.map((docente: any, index: any) => (
                    <TableRow key={index}>
                      <TableCell>
                        <p className=" text-lg">
                          {`${docente.nombre} ${docente.aPaterno} ${
                            docente.aMaterno ? docente.aMaterno : ""
                          }`}
                        </p>
                      </TableCell>
                      <TableCell>{obtenerNombresGrupos(docente.id)}</TableCell>
                      <TableCell>
                        <p className=" text-lg">{`${docente.telefono}`}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col md:flex-row justify-center items-center">
                          <Tooltip content="Detalles">
                            <Button
                              isIconOnly
                              size="md"
                              className=" bg-verde"
                              onPress={() => handleDetalles(docente)}
                            >
                              <CgDetailsMore />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Editar">
                            <Button
                              isIconOnly
                              size="md"
                              className="bg-verdeDetails mx-0  my-2 md:mx-3 md:my-0"
                              onPress={() => handleModificar(docente)}
                            >
                              <FaRegEdit style={{ fontSize: "15px" }} />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Eliminar">
                            <Button
                              isIconOnly
                              size="md"
                              className=" bg-verdeFuerte"
                              onClick={() => handleEliminar(docente)}
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
      </div>

      <RegistrarDocente
        isOpen={isOpenRegistro}
        onOpen={onOpenRegistro}
        onOpenChange={onOpenChangeRegistro}
        docente={docente}
        setDocente={setDocente}
        setRefetch={setRefetch}
      />
      <ConsultaEspecifica
        isOpen={isOpenDetalles}
        onOpen={onOpenDetalles}
        onOpenChange={onOpenChangeDetalles}
        docente={docenteSeleccionado}
      />
      <ConfirmarEliminar
        isOpen={isOpenEliminar}
        onOpenChange={onOpenChangeEliminar}
        docente={docenteSeleccionado}
        fetchDocentes={fetchDocentes}
      />
      <ModificarDocente
        isOpen={isOpenModificar}
        onOpen={onOpenModificar}
        onOpenChange={onOpenChangeModificar}
        docente={docenteSeleccionado}
        setRefetch={setRefetch}
      />
    </MainLayout>
  );
};

export default ConsultaDocente;
