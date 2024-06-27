"use client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { Neurodivergencia } from "@prisma/client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiSquaresPlus } from "react-icons/hi2";
import NeurodivergenciaPlantilla from "./neurodivergenciaPlantilla";

function Neurodivergencias() {
  const [neurodivergencias, setNeurodivergencias] = useState<
    Neurodivergencia[]
  >([]);
  const [nombre, setNombre] = useState("");
  const [neurodivergenciaSeleccionada, setNeurodivergenciaSeleccionada] =
    useState<Neurodivergencia | null>(null);
  const {
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
    isOpen: isEditOpen,
  } = useDisclosure();

  const { onOpen, onOpenChange, isOpen } = useDisclosure();

  const fetchNEE = async () => {
    try {
      const response = await axios.get("/api/nee");
      if (response.status === 500) return;
      setNeurodivergencias(response.data);
    } catch (e: any) {
      if (e.response.status === 404 || e.response.status === 500) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  };

  const registrar = async () => {
    const data = {
      nombre: nombre,
    };

    try {
      const response = await axios.post("/api/nee", data);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Se registró la neurodivergencia.");
        setNombre("");
        fetchNEE();
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (
        e.response.status === 404 ||
        e.response.status === 500 ||
        e.response.status === 400
      ) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  };

  const eliminar = async (onClose: () => void) => {
    if (!neurodivergenciaSeleccionada) return;

    try {
      const response = await axios.delete(
        `/api/nee/${neurodivergenciaSeleccionada.id}`
      );
      if (response.status >= 200 && response.status < 300) {
        toast.success("Se eliminó la neurodivergencia.");
        fetchNEE();
        onClose();
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  const modificar = async () => {
    if (!neurodivergenciaSeleccionada) {
      return;
    }

    const data = { nombre: nombre };
    try {
      const response = await axios.put(
        `/api/nee/${neurodivergenciaSeleccionada.id}`,
        data
      );
      if (response.status >= 200 && response.status < 300) {
        toast.success("Se modificó la neurodivergencia.");
        setNombre("");
        setNeurodivergenciaSeleccionada(null);
        fetchNEE();
        onEditOpenChange();
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (
        e.response.status === 404 ||
        e.response.status === 500 ||
        e.response.status === 400
      ) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  };

  const handleModificar = (neurodivergencia: Neurodivergencia) => {
    setNeurodivergenciaSeleccionada(neurodivergencia);
    setNombre(neurodivergencia.nombre);
    onEditOpen();
  };

  const handleRegistrar = () => {
    if (nombre === "") {
      toast.error("Es necesario el nombre");
      return;
    } else {
      registrar();
    }
  };

  const handleEliminar = (neurodivergencia: Neurodivergencia) => {
    setNeurodivergenciaSeleccionada(neurodivergencia);
    onOpen();
  };
  useEffect(() => {
    fetchNEE();
  }, []);

  return (
    <div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                ¿Seguro que desea eliminar la neurodivergencia:{" "}
                {neurodivergenciaSeleccionada?.nombre}?
              </ModalHeader>
              <ModalFooter>
                <div className="flex flex-row gap-2">
                  <Button onPress={onClose}  className=" bg-verde">Cancelar</Button>
                  <Button className=" bg-verdeFuerte text-[#ffffff]" onPress={() => eliminar(onClose)}>
                    Eliminar
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Modificar Neurodivergencia</ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  label="Nombre NEE"
                  placeholder="Ingresa el nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row gap-2">
                  <Button onPress={onClose} className=" bg-verde">Cancelar</Button>
                  <Button className=" bg-verdeFuerte text-[#ffffff]" onPress={modificar}>
                    Guardar
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Popover placement="bottom" showArrow offset={10}>
        <PopoverTrigger>
          <Button isIconOnly className=" bg-verdeFuerte text-[#ffffff]">
          <HiSquaresPlus />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] bg-white">
          <div className=" font-bold py-2">Gestionar neurodivergencias</div>
          <div className=" overflow-auto h-52 rounded-xl p-2 bg-slate-100">
            <ul>
              {neurodivergencias.length === 0 ? (
                <p>No hay neurodivergencias disponibles.</p>
              ) : (
                neurodivergencias.map((neurodivergencia, index) => (
                  <NeurodivergenciaPlantilla neurodivergencia={neurodivergencia} handleModificar={handleModificar} handleEliminar={handleEliminar} key={index}/>
                ))
              )}
            </ul>
          </div>
          <div className=" my-2">
          <Input
            type="text"
            placeholder="Ingrese el nombre de la NEE"
            onChange={(e) => setNombre(e.target.value)}
          />
          <div className="flex justify-center pt-2">
          <Button onPress={handleRegistrar} className="w-full bg-headerNav text-[#ffffff]">Guardar</Button>
          </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default Neurodivergencias;
