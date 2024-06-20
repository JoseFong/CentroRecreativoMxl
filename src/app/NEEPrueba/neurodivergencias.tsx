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
                  <Button onPress={onClose}>Cancelar</Button>
                  <Button color="danger" onPress={() => eliminar(onClose)}>
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
                  <Button onPress={onClose}>Cancelar</Button>
                  <Button color="primary" onPress={modificar}>
                    Guardar
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      Neurodivergencias
      <Popover placement="bottom" showArrow offset={10}>
        <PopoverTrigger>
          <Button color="primary">+</Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px]">
          <ul>
            {neurodivergencias.length === 0 ? (
              <p>No hay neurodivergencias disponibles.</p>
            ) : (
              neurodivergencias.map((neurodivergencia, index) => (
                <li key={index}>
                  {" "}
                  {neurodivergencia.nombre}
                  <button onClick={() => handleEliminar(neurodivergencia)}>
                    {" "}
                    eliminar{" "}
                  </button>
                  <button onClick={() => handleModificar(neurodivergencia)}>
                    {" "}
                    Modificar{" "}
                  </button>
                </li>
              ))
            )}
          </ul>
          <Input
            type="text"
            label="Nombre NEE"
            placeholder="Ingresa el nombre"
            onChange={(e) => setNombre(e.target.value)}
          />
          <Button onPress={handleRegistrar}>Guardar</Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default Neurodivergencias;
