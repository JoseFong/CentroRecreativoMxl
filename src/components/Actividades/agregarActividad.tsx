import { textoVacio } from "@/utils/validaciones";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

function AgregarActividad({
  isOpen,
  onOpenChange,
  fetchActividades,
}: {
  isOpen: any;
  onOpenChange: any;
  fetchActividades: () => void;
}) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [enviado, setEnviado] = useState(false);

  const {
    onOpen: onConfOpen,
    onOpenChange: onConfOpenChange,
    isOpen: isConfOpen,
  } = useDisclosure();

  const handleConfirmar = async (onClose2: any) => {
    const data = {
      nombre: nombre,
      descripcion: descripcion,
    };

    try {
      const response = await axios.post("/api/actividades", data);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Actividad registrada exitosamente.");
        fetchActividades();
        reset();
        onClose2();
        onOpenChange(false);
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

  const handleRegistrar = () => {
    setEnviado(true);
    try {
      if (textoVacio(nombre)) throw new Error("No deje campos vacios.");
      onConfOpen();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const reset = () => {
    setEnviado(false);
    setNombre("");
    setDescripcion("");
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Registar Actividad</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <Input
                    isRequired
                    label="Nombre"
                    type="text"
                    placeholder="Nombre"
                    labelPlacement="outside"
                    isInvalid={enviado && textoVacio(nombre)}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                  <Input
                    label="Descripción (Opcional)"
                    type="text"
                    placeholder="Descripción"
                    labelPlacement="outside"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose} className="bg-verde">Cancelar</Button>
                <Button onPress={handleRegistrar} className="text-white bg-verdeFuerte">Aceptar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isConfOpen} onOpenChange={onConfOpenChange}>
        <ModalContent>
          {(onClose2) => (
            <>
              <ModalHeader>
                ¿Seguro que desea registrar la actividad?
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col">
                  <p>
                    <span className="font-bold">Nombre: </span>
                    {nombre}
                  </p>
                  {descripcion !== "" && (
                    <p>
                      <span className="font-bold">Descripción: </span>
                      {descripcion}
                    </p>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose2} className="bg-verde">Cancelar</Button>
                <Button onPress={() => handleConfirmar(onClose2)} className="text-white bg-verdeFuerte">
                  Aceptar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default AgregarActividad;
