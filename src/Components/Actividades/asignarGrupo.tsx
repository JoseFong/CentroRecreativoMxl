import { validarHoras } from "@/utils/validaciones";
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TimeInput,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Dia {
  nombre: string;
  inicio: string;
  fin: string;
}

function AsignarGrupo({
  isOpen,
  onOpenChange,
  fetchGrupos,
  actividad,
}: {
  isOpen: any;
  onOpenChange: any;
  fetchGrupos: () => void;
  actividad: any;
}) {
  return (
    <>
      {actividad && (
        <AsignarGrupoModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          fetchGrupos={fetchGrupos}
          actividad={actividad}
        />
      )}
    </>
  );
}

export function AsignarGrupoModal({
  isOpen,
  onOpenChange,
  fetchGrupos,
  actividad,
}: {
  isOpen: any;
  onOpenChange: any;
  fetchGrupos: () => void;
  actividad: any;
}) {
  const [cargando, setCargando] = useState(false);
  const [gruposDisponibles, setGruposDisponibles] = useState([]);

  const [grupoId, setGrupoId] = useState("");

  const [lunes, setLunes] = useState(false);
  const [miercoles, setMiercoles] = useState(false);
  const [martes, setMartes] = useState(false);
  const [jueves, setJueves] = useState(false);
  const [viernes, setViernes] = useState(false);
  const [sabado, setSabado] = useState(false);

  const [hilunes, setHilunes] = useState("");
  const [himartes, setHimartes] = useState("");
  const [himiercoles, setHimiercoles] = useState("");
  const [hijueves, setHijueves] = useState("");
  const [hiviernes, setHiviernes] = useState("");
  const [hisabado, setHisabado] = useState("");

  const [hflunes, setHflunes] = useState("");
  const [hfmartes, setHfmartes] = useState("");
  const [hfmiercoles, setHfmiercoles] = useState("");
  const [hfjueves, setHfjueves] = useState("");
  const [hfviernes, setHfviernes] = useState("");
  const [hfsabado, setHfsabado] = useState("");
  const [enviado, setEnviado] = useState(false);

  const [horarioString, setHorarioString] = useState("");

  useEffect(() => {
    setEnviado(false);
    setCargando(true);
    fetchGruposDisponibles();
    reset();
  }, [actividad, onOpenChange]);

  const fetchGruposDisponibles = async () => {
    try {
      const response = await axios.get(
        "/api/grupos/gruposDisponibles/" + actividad.id
      );
      if (response.status >= 200 && response.status < 300) {
        setGruposDisponibles(response.data);
        setCargando(false);
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

  interface Dia {
    inicio: string;
    fin: string;
  }

  const handleAceptar = () => {
    setEnviado(true);
    try {
      const horario: { [key: string]: Dia } = {};

      if (grupoId === "") throw new Error("Seleccione un grupo");

      if (!lunes && !martes && !miercoles && !jueves && !viernes && !sabado)
        throw new Error("Seleccione por lo menos un día.");

      if (lunes) {
        if (hilunes === "" || hilunes === undefined)
          throw new Error(
            "Seleccione una hora de inicio válida para el día Lunes."
          );
        if (hflunes === "" || hflunes === undefined)
          throw new Error(
            "Seleccione una hora de fin válida para el día Lunes."
          );
        if (validarHoras(hilunes, hflunes))
          throw new Error("Seleccione horas válidas para el día Lunes.");
      }

      if (martes) {
        if (himartes === "" || himartes === undefined)
          throw new Error(
            "Seleccione una hora de inicio válida para el día Martes."
          );
        if (hfmartes === "" || hfmartes === undefined)
          throw new Error(
            "Seleccione una hora de fin válida para el día Martes."
          );
        if (validarHoras(himartes, hfmartes))
          throw new Error("Seleccione horas válidas para el día Martes.");
      }

      if (miercoles) {
        if (himiercoles === "" || himiercoles === undefined)
          throw new Error(
            "Seleccione una hora de inicio válida para el día Miércoles."
          );
        if (hfmiercoles === "" || hfmiercoles === undefined)
          throw new Error(
            "Seleccione una hora de fin válida para el día Miércoles."
          );
        if (validarHoras(himiercoles, hfmiercoles))
          throw new Error("Seleccione horas válidas para el día Miércoles.");
      }

      if (jueves) {
        if (hijueves === "" || hijueves === undefined)
          throw new Error(
            "Seleccione una hora de inicio válida para el día Jueves."
          );
        if (hfjueves === "" || hfjueves === undefined)
          throw new Error(
            "Seleccione una hora de fin válida para el día Jueves."
          );
        if (validarHoras(hijueves, hfjueves))
          throw new Error("Seleccione horas válidas para el día Jueves.");
      }

      if (viernes) {
        if (hiviernes === "" || hiviernes === undefined)
          throw new Error(
            "Seleccione una hora de inicio válida para el día Viernes."
          );
        if (hfviernes === "" || hfviernes === undefined)
          throw new Error(
            "Seleccione una hora de fin válida para el día Viernes."
          );
        if (validarHoras(hiviernes, hfviernes))
          throw new Error("Seleccione horas válidas para el día Viernes.");
      }

      if (sabado) {
        if (hisabado === "" || hisabado === undefined)
          throw new Error(
            "Seleccione una hora de inicio válida para el día Sábado."
          );
        if (hfsabado === "" || hfsabado === undefined)
          throw new Error(
            "Seleccione una hora de fin válida para el día Sábado."
          );
        if (validarHoras(hisabado, hfsabado))
          throw new Error("Seleccione horas válidas para el día Sábado.");
      }

      if (lunes)
        horario.lunes = {
          inicio: hilunes,
          fin: hflunes,
        };
      if (martes)
        horario.martes = {
          inicio: himartes,
          fin: hfmartes,
        };
      if (miercoles)
        horario.miercoles = {
          inicio: himiercoles,
          fin: hfmiercoles,
        };
      if (jueves)
        horario.jueves = {
          inicio: hijueves,
          fin: hfjueves,
        };
      if (viernes)
        horario.viernes = {
          inicio: hiviernes,
          fin: hfviernes,
        };
      if (sabado)
        horario.sabado = {
          inicio: hisabado,
          fin: hfsabado,
        };

      const hs = JSON.stringify(horario);
      setHorarioString(hs);
      onConfOpen();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const asignar = async (onClose2: any) => {
    const data = {
      horario: horarioString,
      grupoId: parseInt(grupoId),
      actividadId: actividad.id,
    };

    try {
      const response = await axios.post("/api/grupoAct", data);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Se asignó exitosamente el grupo.");
        onClose2();
        reset();
        fetchGrupos();
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

  const reset = () => {
    setGrupoId("");
    setEnviado(false);
    setLunes(false);
    setHilunes("");
    setHflunes("");

    setMartes(false);
    setHimartes("");
    setHfmartes("");

    setMiercoles(false);
    setHimiercoles("");
    setHfmiercoles("");

    setJueves(false);
    setHijueves("");
    setHfjueves("");

    setViernes(false);
    setHiviernes("");
    setHfviernes("");

    setSabado(false);
    setHisabado("");
    setHfsabado("");
  };

  const {
    isOpen: isConfOpen,
    onOpen: onConfOpen,
    onOpenChange: onConfOpenChange,
  } = useDisclosure();

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Asignar grupo a {actividad.nombre}</ModalHeader>
              <ModalBody>
                {cargando ? (
                  <Spinner size="lg" />
                ) : (
                  <>
                    {gruposDisponibles.length === 0 ? (
                      <p>No hay grupos disponibles.</p>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <Select
                          label="Grupo"
                          labelPlacement="outside"
                          placeholder="Grupo"
                          value={grupoId}
                          isInvalid={enviado && grupoId === ""}
                          onChange={(e) => setGrupoId(e.target.value)}
                        >
                          {gruposDisponibles.map((gr: any) => (
                            <SelectItem key={gr.id} value={gr.id}>
                              {gr.nombre}
                            </SelectItem>
                          ))}
                        </Select>
                        <table className="mt-3">
                          <thead>
                            <tr>
                              <th>Día</th>
                              <th>Hora de inicio</th>
                              <th>Hora de fin</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <div className="flex flex-row items-center justify-between">
                                  <label>Lunes</label>
                                  <Checkbox
                                    onChange={() => setLunes(!lunes)}
                                    isSelected={lunes}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center justify-center">
                                  <input
                                    className="bg-white"
                                    type="time"
                                    value={hilunes}
                                    onChange={(e) => setHilunes(e.target.value)}
                                    disabled={!lunes}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center justify-center">
                                  <input
                                    className="bg-white"
                                    type="time"
                                    value={hflunes}
                                    onChange={(e) => setHflunes(e.target.value)}
                                    disabled={!lunes}
                                  />
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div className="flex flex-row items-center justify-between">
                                  <label>Martes</label>
                                  <Checkbox
                                    onChange={() => setMartes(!martes)}
                                    isSelected={martes}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center justify-center">
                                  <input
                                    className="bg-white"
                                    type="time"
                                    value={himartes}
                                    onChange={(e) =>
                                      setHimartes(e.target.value)
                                    }
                                    disabled={!martes}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center justify-center">
                                  <input
                                    className="bg-white"
                                    type="time"
                                    value={hfmartes}
                                    onChange={(e) =>
                                      setHfmartes(e.target.value)
                                    }
                                    disabled={!martes}
                                  />
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div className="flex flex-row items-center justify-between">
                                  <label>Miércoles</label>
                                  <Checkbox
                                    onChange={() => setMiercoles(!miercoles)}
                                    isSelected={miercoles}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center justify-center">
                                  <input
                                    className="bg-white"
                                    type="time"
                                    value={himiercoles}
                                    onChange={(e) =>
                                      setHimiercoles(e.target.value)
                                    }
                                    disabled={!miercoles}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center justify-center">
                                  <input
                                    className="bg-white"
                                    type="time"
                                    value={hfmiercoles}
                                    onChange={(e) =>
                                      setHfmiercoles(e.target.value)
                                    }
                                    disabled={!miercoles}
                                  />
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div className="flex flex-row items-center justify-between">
                                  <label>Jueves</label>
                                  <Checkbox
                                    onChange={() => setJueves(!jueves)}
                                    isSelected={jueves}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center justify-center">
                                  <input
                                    className="bg-white"
                                    type="time"
                                    value={hijueves}
                                    onChange={(e) =>
                                      setHijueves(e.target.value)
                                    }
                                    disabled={!jueves}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center justify-center">
                                  <input
                                    className="bg-white"
                                    type="time"
                                    value={hfjueves}
                                    onChange={(e) =>
                                      setHfjueves(e.target.value)
                                    }
                                    disabled={!jueves}
                                  />
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div className="flex flex-row items-center justify-between">
                                  <label>Viernes</label>
                                  <Checkbox
                                    onChange={() => setViernes(!viernes)}
                                    isSelected={viernes}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center justify-center">
                                  <input
                                    className="bg-white"
                                    type="time"
                                    value={hiviernes}
                                    onChange={(e) =>
                                      setHiviernes(e.target.value)
                                    }
                                    disabled={!viernes}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center justify-center">
                                  <input
                                    className="bg-white"
                                    type="time"
                                    value={hfviernes}
                                    onChange={(e) =>
                                      setHfviernes(e.target.value)
                                    }
                                    disabled={!viernes}
                                  />
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div className="flex flex-row items-center justify-between">
                                  <label>Sábado</label>
                                  <Checkbox
                                    onChange={() => setSabado(!sabado)}
                                    isSelected={sabado}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center justify-center">
                                  <input
                                    className="bg-white"
                                    type="time"
                                    value={hisabado}
                                    onChange={(e) =>
                                      setHisabado(e.target.value)
                                    }
                                    disabled={!sabado}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center justify-center">
                                  <input
                                    className="bg-white"
                                    type="time"
                                    value={hfsabado}
                                    onChange={(e) =>
                                      setHfsabado(e.target.value)
                                    }
                                    disabled={!sabado}
                                  />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Cancelar</Button>
                <Button onPress={handleAceptar}>Aceptar</Button>
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
                ¿Desea asignar el grupo a la actividad '{actividad.nombre}'?
              </ModalHeader>
              <ModalFooter>
                <Button onPress={onClose2}>Cancelar</Button>
                <Button onPress={() => asignar(onClose2)}>Aceptar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default AsignarGrupo;
