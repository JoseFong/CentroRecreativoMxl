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
import VerHorario from "./verHorario";
import ModificarHorario from "./modificarHorario";
import { Grupo } from "@prisma/client";

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
  const [selectedGrupo, setSelectedGrupo] = useState<Grupo>();

  const nombreinit = actividad.nombre;
  const descripcioninit = actividad.descripcion;

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

  const {
    onOpen: onVHOpen,
    onOpenChange: onVHOpenChange,
    isOpen: isVHOpen,
  } = useDisclosure();

  const {
    onOpen: onDesOpen,
    onOpenChange: onDesOpenChange,
    isOpen: isDesOpen,
  } = useDisclosure();

  const {
    onOpen: onModHOpen,
    onOpenChange: onModHOpenChange,
    isOpen: isModHOpen,
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

  const handleVerHorario = (grupo: any) => {
    setSelectedGrupo(grupo);
    onVHOpen();
  };

  const handleDesasignar = (grupo: any) => {
    setSelectedGrupo(grupo);
    onDesOpen();
  };

  const handleModificarHorario = (grupo: any) => {
    setSelectedGrupo(grupo);
    onModHOpen();
  };

  const desasignar = async (onClose: any) => {
    const data = {
      grupoId: selectedGrupo?.id,
      actividadId: actividad.id,
    };
    try {
      const response = await axios.patch(
        "/api/grupoAct/eliminarGrupoAct",
        data
      );
      if (response.status >= 200 && response.status < 300) {
        toast.success("Se desasignó exitosamente.");
        fetchGruposDeActividad();
        onClose();
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-xl">
                Información de {actividad.nombre}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-row gap-5">
                  <div className="flex flex-col gap-4 items-center w-1/4">
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
                  <div className="items-center flex flex-col gap-1 w-3/4">
                    <h1 className="font-bold">Grupos</h1>
                    {cargandoGrupos ? (
                      <Spinner size="lg" color="warning" />
                    ) : (
                      <>
                        {gruposDeAct.length === 0 ? (
                          <p>No hay grupos en esta actividad.</p>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableColumn className=" bg-headerNav text-[#ffffff] ">
                                Grupo
                              </TableColumn>
                              <TableColumn className=" bg-headerNav text-[#ffffff] ">
                                Horario
                              </TableColumn>
                              <TableColumn className=" bg-headerNav text-[#ffffff] ">
                                Modificar
                              </TableColumn>
                              <TableColumn className=" bg-headerNav text-[#ffffff] ">
                                Desasignar
                              </TableColumn>
                            </TableHeader>
                            <TableBody>
                              {gruposDeAct.map((grupo: any) => (
                                <TableRow>
                                  <TableCell>{grupo.nombre}</TableCell>
                                  <TableCell>
                                    <Button
                                      onPress={() => handleVerHorario(grupo)}
                                      className="border-2 border-gray-500 bg-gray-100"
                                    >
                                      Ver horario
                                    </Button>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      onPress={() =>
                                        handleModificarHorario(grupo)
                                      }
                                      className="border-2 border-gray-500 bg-gray-100"
                                    >
                                      Modificar Horario
                                    </Button>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      onPress={() => handleDesasignar(grupo)}
                                      className="border-2 border-gray-500 bg-gray-100"
                                    >
                                      Desasignar
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </>
                    )}
                    <Button
                      onPress={onGrupOpen}
                      className="mt-4 bg-verdeFuerte text-[#ffffff] border-1"
                    >
                      Asignar grupo
                    </Button>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose} className="bg-verde">
                  Cancelar
                </Button>
                {nombre === nombreinit && descripcion === descripcioninit ? (
                  <Button
                    isDisabled={1 === 1}
                    className="bg-verdeFuerte text-[#ffffff]"
                  >
                    Modificar
                  </Button>
                ) : (
                  <Button
                    onPress={handleModificar}
                    className="bg-verdeFuerte text-[#ffffff]"
                  >
                    Modificar
                  </Button>
                )}
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
                <Button onPress={onClose2} className="bg-verde">
                  Cancelar
                </Button>
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
      <VerHorario
        grupo={selectedGrupo}
        actividad={actividad}
        isOpen={isVHOpen}
        onOpenChange={onVHOpenChange}
      />
      <ModificarHorario
        grupo={selectedGrupo}
        isOpen={isModHOpen}
        onOpenChange={onModHOpenChange}
        fetchGrupos={fetchGruposDeActividad}
        actividad={actividad}
      />
      {selectedGrupo && (
        <Modal isOpen={isDesOpen} onOpenChange={onDesOpenChange}>
          <ModalContent>
            {(onClose3) => (
              <>
                <ModalHeader>
                  ¿Desea desasignar al grupo '{selectedGrupo.nombre}' de '
                  {actividad.nombre}'?
                </ModalHeader>
                <ModalBody>
                  <p className="text-red-600">Esta operación es permanente.</p>
                </ModalBody>
                <ModalFooter>
                  <Button onPress={onClose3} className="bg-verde">
                    Cancelar
                  </Button>
                  <Button onPress={() => desasignar(onClose3)}>Aceptar</Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default ModActividad;
