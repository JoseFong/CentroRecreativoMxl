"use client";

import React, { useEffect, useState } from "react";
import { Image } from "@nextui-org/react";
import MainLayout from "../Layout/MainLayout";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import DocumentoVacioLogo from "./DocumentoVacioLogo";
import ListaDeAsistenciaGrupo from "./ListaDeAsistenciaGrupo";
import axios from "axios";
import toast from "react-hot-toast";
import ListaDeAsistenciaTodos from "./ListaDeAsistenciaTodos";
import DocumentoPermiso from "./DocumentoPermiso";
import DocumentoEnBlanco from "./DocumentoEnBlanco";
import CalendarioImg from "@/Assets/calendarioImg.png";
import Calendario from "../Calendario/Calendario";

function ConsultaDocumentos() {
  const [grupos, setGrupos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [alumnos, setAlumnos] = useState([]);
  const [docentes, setDocentes] = useState([]);

  useEffect(() => {
    fetchGrupos();
    fetchAlumnos();
    fetchDocentes();
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

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenLista,
    onOpen: onOpenLista,
    onOpenChange: onOpenChangeLista,
  } = useDisclosure();
  const {
    isOpen: isOpenTodos,
    onOpen: onOpenTodos,
    onOpenChange: onOpenChangeTodos,
  } = useDisclosure();
  const {
    isOpen: isOpenBlanco,
    onOpen: onOpenBlanco,
    onOpenChange: onOpenChangeBlanco,
  } = useDisclosure();
  const {
    isOpen: isOpenPermiso,
    onOpen: onOpenPermiso,
    onOpenChange: onOpenChangePermiso,
  } = useDisclosure();

  const {
    isOpen: isOpenCalendario,
    onOpen: onOpenCalendario,
    onOpenChange: onOpenChangeCalendario,
  } = useDisclosure();

  const cardsData = [
    {
      title: "Imprimible",
      description: "Documento vacio (Logo y firma)",
      image: "https://i.imgur.com/22E0no7.png",
      onOpen: onOpen,
    },
    {
      title: "Imprimible",
      description: "Lista de asistencia (por grupos)",
      image: "https://i.imgur.com/GT3hn6n.png",
      onOpen: onOpenLista,
    },
    {
      title: "Imprimible",
      description: "Lista de asistencia (Todos)",
      image: "https://i.imgur.com/0dCI6tr.png",
      onOpen: onOpenTodos,
    },
    {
      title: "Imprimible",
      description: "Documento en blanco con logo",
      image: "https://i.imgur.com/aXPJMUu.png",
      onOpen: onOpenBlanco,
    },
    {
      title: "Imprimible",
      description: "Permiso de salida",
      image: "https://i.imgur.com/quniSrB.png",
      onOpen: onOpenPermiso,
    },
    {
      title: "Imprimible",
      description: "Calendario de salidas",
      image: "https://i.imgur.com/CYwhXFD.png",
      onOpen: onOpenCalendario,
    },
  ];

  return (
    <div>
      <MainLayout>
        <div>
          <div className="flex flex-row m-4 md:px-10 md:pt-10 md:pb-4">
            <div className="flex flex-col md:flex-row">
              <h1 className="text-4xl font-bold">Documentos</h1>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 m-4 ">
            {cardsData.map((card, index) => (
              <Card
                key={index}
                className="w-full"
                isPressable
                onPress={card.onOpen}
              >
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <p className="text-tiny uppercase font-bold">{card.title}</p>
                  <h4 className="font-bold text-large">{card.description}</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-2 flex items-center">
                  <Image
                    alt="Card background"
                    className="object-cover rounded-xl"
                    src={card.image}
                    width={270}
                  />
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </MainLayout>
      <DocumentoVacioLogo isOpen={isOpen} onOpenChange={onOpenChange} />
      <ListaDeAsistenciaGrupo
        docentes={docentes}
        alumnos={alumnos}
        grupos={grupos}
        isOpen={isOpenLista}
        onOpenChange={onOpenChangeLista}
      />
      <ListaDeAsistenciaTodos
        alumnos={alumnos}
        isOpen={isOpenTodos}
        onOpenChange={onOpenChangeTodos}
      />
      <DocumentoEnBlanco
        isOpen={isOpenBlanco}
        onOpenChange={onOpenChangeBlanco}
      />
      <DocumentoPermiso
        isOpen={isOpenPermiso}
        onOpenChange={onOpenChangePermiso}
      />
      <Calendario
        isOpen={isOpenCalendario}
        onOpenChange={onOpenChangeCalendario}
      />
    </div>
  );
}

export default ConsultaDocumentos;
