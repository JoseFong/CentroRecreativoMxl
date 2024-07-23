import { textoVacio } from "@/utils/validaciones";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AsignarGrupo from "./asignarGrupo";

function ModActividad({
  actividad,
  fetchActividades,
  isOpen,
  onOpenChange,
}: {
  actividad: any;
  fetchActividades: () => void;
  isOpen: any;
  onOpenChange: any;
}) {
  return (
    <>
      {actividad && (
        <ModActividadModal
          actividad={actividad}
          fetchActividades={fetchActividades}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
    </>
  );
}

function ModActividadModal({
  actividad,
  fetchActividades,
  isOpen,
  onOpenChange,
}: {
  actividad: any;
  fetchActividades: () => void;
  isOpen: any;
  onOpenChange: any;
}) {
  const [nombre, setNombre] = useState(actividad.nombre);
  const [descripcion, setDescripcion] = useState(actividad.descripcion);
  const [enviado, setEnviado] = useState(false);
  const [gruposDeAct, setGruposDeAct] = useState([]);
  const [cargandoGrupos, setCargandoGrupos] = useState(true);

  const reset = () => {
    setEnviado(false);
    setNombre(actividad.nombre);
    setDescripcion(actividad.descripcion);
  };

  useEffect(() => {
    reset();
  }, [onOpenChange]);

  useEffect(() => {
    fetchGruposDeActividad();
  }, [actividad]);

  const fetchGruposDeActividad = async () => {
    setCargandoGrupos(true);
    try {
      const response = await axios.get(
        "/api/grupos/gruposDeActividad/" + actividad.id
      );
      if (response.status >= 200 && response.status < 300) {
        setGruposDeAct(response.data);
        setCargandoGrupos(false);
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

  const {
    onOpen: onConfOpen,
    onOpenChange: onConfOpenChange,
    isOpen: isConfOpen,
  } = useDisclosure();

  const {
    onOpen: onGrupOpen,
    onOpenChange: onGrupOpenChange,
    isOpen: isGrupOpen,
  } = useDisclosure();

  const handleModificar = () => {
    setEnviado(true);
    try {
      if (textoVacio(nombre)) throw new Error("No deje campos vacios.");
      onConfOpen();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleConfirmar = async (onClose2: any) => {
    const data = {
      nombre: nombre,
      descripcion: descripcion,
    };
    try {
      const response = await axios.patch(
        "/api/actividades/" + actividad.id,
        data
      );
      if (response.status >= 200 && response.status < 300) {
        toast.success("Actividad modificada exitosamente.");
        fetchActividades();
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

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Información de {actividad.nombre}</ModalHeader>
              <ModalBody>
                <div className="flex flex-row gap-5">
                  <div className="flex flex-col gap-2 items-center w-1/2">
                    <h1 className="font-bold">Información</h1>
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
                  <div className="items-center flex flex-col gap-1 w-1/2">
                    <h1 className="font-bold">Grupos</h1>
                    {cargandoGrupos ? (
                      <Spinner size="lg" />
                    ) : (
                      <>
                        {gruposDeAct.length === 0 ? (
                          <p>No hay grupos en esta actividad.</p>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableColumn>Grupo</TableColumn>
                              <TableColumn>Horario</TableColumn>
                              <TableColumn>Modificar</TableColumn>
                              <TableColumn>Desasignar</TableColumn>
                            </TableHeader>
                            <TableBody>
                              {gruposDeAct.map((grupo: any) => (
                                <TableRow>
                                  <TableCell>{grupo.nombre}</TableCell>
                                  <TableCell>Ver horario</TableCell>
                                  <TableCell>Modificar</TableCell>
                                  <TableCell>Desasignar</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </>
                    )}
                    <Button color="primary" onPress={onGrupOpen}>
                      Asignar grupo
                    </Button>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Cancelar</Button>
                <Button onPress={handleModificar}>Modificar</Button>
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
                <Button onPress={onClose2}>Cancelar</Button>
                <Button onPress={() => handleConfirmar(onClose2)}>
                  Aceptar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <AsignarGrupo
        isOpen={isGrupOpen}
        onOpenChange={onGrupOpenChange}
        fetchGrupos={fetchGruposDeActividad}
        actividad={actividad}
      />
    </>
  );
}

export default ModActividad;
