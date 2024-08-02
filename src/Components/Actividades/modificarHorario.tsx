import { validarHoras } from "@/utils/validaciones";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
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

function ModificarHorario({
  grupo,
  isOpen,
  onOpenChange,
  fetchGrupos,
  actividad,
}: {
  grupo: any;
  isOpen: any;
  onOpenChange: any;
  fetchGrupos: () => void;
  actividad: any;
}) {
  return (
    <>
      {actividad && (
        <ModificarHorarioModal
          grupo={grupo}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          fetchGrupos={fetchGrupos}
          actividad={actividad}
        />
      )}
    </>
  );
}

export function ModificarHorarioModal({
  grupo,
  isOpen,
  onOpenChange,
  fetchGrupos,
  actividad,
}: {
  grupo: any;
  isOpen: any;
  onOpenChange: any;
  fetchGrupos: () => void;
  actividad: any;
}) {
  const [cargando, setCargando] = useState(false);

  const [registro, setRegistro] = useState();

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
    setCargando(true);
    if (grupo && actividad) {
      setEnviado(false);
      fetchRegistro();
    }
  }, [actividad, onOpenChange, grupo]);

  const fetchRegistro = async () => {
    const data = {
      grupoId: grupo.id,
      actividadId: actividad.id,
    };
    try {
      const response = await axios.patch(
        "/api/grupoAct/grupoActEspecifico",
        data
      );
      if (response.status >= 200 && response.status < 300) {
        setRegistro(response.data);
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

  useEffect(() => {
    setCargando(false);
  }, [registro]);

  interface Dia {
    inicio: string;
    fin: string;
  }

  const handleAceptar = () => {
    setEnviado(true);
    try {
      if (grupoId === "") throw new Error("Seleccione un grupo.");
      if (!lunes && !martes && !miercoles && !jueves && !viernes && !sabado)
        throw new Error("Seleccione al menos un día.");
      if (lunes) {
        if (
          !hilunes ||
          hilunes === "undefined" ||
          hilunes === "null" ||
          hilunes === ""
        )
          throw new Error("Seleccione una hora de inicio para el día Lunes.");
        if (
          !hflunes ||
          hflunes === "undefined" ||
          hflunes === "null" ||
          hflunes === ""
        )
          throw new Error("Seleccione una hora de fin para el día Lunes.");
        if (validarHoras(hilunes, hflunes))
          throw new Error("Seleccione horas válidas en Lunes.");
      }
      if (martes) {
        if (
          !himartes ||
          himartes === "undefined" ||
          himartes === "null" ||
          himartes === ""
        )
          throw new Error("Seleccione una hora de inicio para el día Martes.");
        if (
          !hfmartes ||
          hfmartes === "undefined" ||
          hfmartes === "null" ||
          hfmartes === ""
        )
          throw new Error("Seleccione una hora de fin para el día Martes.");
        if (validarHoras(himartes, hfmartes))
          throw new Error("Seleccione horas válidas en Martes.");
      }

      if (miercoles) {
        if (
          !himiercoles ||
          himiercoles === "undefined" ||
          himiercoles === "null" ||
          himiercoles === ""
        )
          throw new Error(
            "Seleccione una hora de inicio para el día Miércoles."
          );
        if (
          !hfmiercoles ||
          hfmiercoles === "undefined" ||
          hfmiercoles === "null" ||
          hfmiercoles === ""
        )
          throw new Error("Seleccione una hora de fin para el día Miércoles.");
        if (validarHoras(himiercoles, hfmiercoles))
          throw new Error("Seleccione horas válidas en Miércoles.");
      }

      if (jueves) {
        if (
          !hijueves ||
          hijueves === "undefined" ||
          hijueves === "null" ||
          hijueves === ""
        )
          throw new Error("Seleccione una hora de inicio para el día Jueves.");
        if (
          !hfjueves ||
          hfjueves === "undefined" ||
          hfjueves === "null" ||
          hfjueves === ""
        )
          throw new Error("Seleccione una hora de fin para el día Jueves.");
        if (validarHoras(hijueves, hfjueves))
          throw new Error("Seleccione horas válidas en Jueves.");
      }

      if (viernes) {
        if (
          !hiviernes ||
          hiviernes === "undefined" ||
          hiviernes === "null" ||
          hiviernes === ""
        )
          throw new Error("Seleccione una hora de inicio para el día Viernes.");
        if (
          !hfviernes ||
          hfviernes === "undefined" ||
          hfviernes === "null" ||
          hfviernes === ""
        )
          throw new Error("Seleccione una hora de fin para el día Viernes.");
        if (validarHoras(hiviernes, hfviernes))
          throw new Error("Seleccione horas válidas en Viernes.");
      }

      if (sabado) {
        if (
          !hisabado ||
          hisabado === "undefined" ||
          hisabado === "null" ||
          hisabado === ""
        )
          throw new Error("Seleccione una hora de inicio para el día Sábado.");
        if (
          !hfsabado ||
          hfsabado === "undefined" ||
          hfsabado === "null" ||
          hfsabado === ""
        )
          throw new Error("Seleccione una hora de fin para el día Sábado.");
        if (validarHoras(hisabado, hfsabado))
          throw new Error("Seleccione horas válidas en Sábado.");
      }

      const horario: { [key: string]: Dia } = {};

      if (lunes)
        horario.lunes = {
          inicio: hilunes.toString().slice(0, -3),
          fin: hflunes.toString().slice(0, -3),
        };
      if (martes)
        horario.martes = {
          inicio: himartes.toString().slice(0, -3),
          fin: hfmartes.toString().slice(0, -3),
        };
      if (miercoles)
        horario.miercoles = {
          inicio: himiercoles.toString().slice(0, -3),
          fin: hfmiercoles.toString().slice(0, -3),
        };
      if (jueves)
        horario.jueves = {
          inicio: hijueves.toString().slice(0, -3),
          fin: hfjueves.toString().slice(0, -3),
        };
      if (viernes)
        horario.viernes = {
          inicio: hiviernes.toString().slice(0, -3),
          fin: hfviernes.toString().slice(0, -3),
        };
      if (sabado)
        horario.sabado = {
          inicio: hisabado.toString().slice(0, -3),
          fin: hfsabado.toString().slice(0, -3),
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
                    <div className="flex flex-col gap-1">
                      <Input
                        placeholder="Grupo"
                        value={grupo.nombre}
                        isReadOnly
                        label="Grupo"
                        labelPlacement="outside"
                      />
                      <div className="flex flex-row justify-around mt-3">
                        <label>Día</label>
                        <label>Hora de inicio</label>
                        <label>Hora de fin</label>
                      </div>
                      <div className="flex flex-row gap-2 items-center justify-center">
                        <label>Lunes</label>
                        <Checkbox
                          onChange={() => setLunes(!lunes)}
                          isSelected={lunes}
                        />

                        <TimeInput
                          isDisabled={!lunes}
                          value={hilunes}
                          onChange={setHilunes}
                        />
                        <TimeInput
                          isDisabled={!lunes}
                          value={hflunes}
                          onChange={setHflunes}
                        />
                      </div>
                      <div className="flex flex-row gap-2 items-center justify-center">
                        <label>Martes</label>
                        <Checkbox
                          onChange={() => setMartes(!martes)}
                          isSelected={martes}
                        />
                        <TimeInput
                          isDisabled={!martes}
                          value={himartes}
                          onChange={setHimartes}
                        />
                        <TimeInput
                          isDisabled={!martes}
                          value={hfmartes}
                          onChange={setHfmartes}
                        />
                      </div>

                      <div className="flex flex-row gap-2 items-center justify-center">
                        <label>Miércoles</label>
                        <Checkbox
                          onChange={() => setMiercoles(!miercoles)}
                          isSelected={miercoles}
                        />
                        <TimeInput
                          isDisabled={!miercoles}
                          value={himiercoles}
                          onChange={setHimiercoles}
                        />
                        <TimeInput
                          isDisabled={!miercoles}
                          value={hfmiercoles}
                          onChange={setHfmiercoles}
                        />
                      </div>

                      <div className="flex flex-row gap-2 items-center justify-center">
                        <label>Jueves</label>
                        <Checkbox
                          onChange={() => setJueves(!jueves)}
                          isSelected={jueves}
                        />
                        <TimeInput
                          isDisabled={!jueves}
                          value={hijueves}
                          onChange={setHijueves}
                        />
                        <TimeInput
                          isDisabled={!jueves}
                          value={hfjueves}
                          onChange={setHfjueves}
                        />
                      </div>

                      <div className="flex flex-row gap-2 items-center justify-center">
                        <label>Viernes</label>
                        <Checkbox
                          onChange={() => setViernes(!viernes)}
                          isSelected={viernes}
                        />
                        <TimeInput
                          isDisabled={!viernes}
                          value={hiviernes}
                          onChange={setHiviernes}
                        />
                        <TimeInput
                          isDisabled={!viernes}
                          value={hfviernes}
                          onChange={setHfviernes}
                        />
                      </div>

                      <div className="flex flex-row gap-2 items-center justify-center">
                        <label>Sábado</label>
                        <Checkbox
                          onChange={() => setSabado(!sabado)}
                          isSelected={sabado}
                        />
                        <TimeInput
                          isDisabled={!sabado}
                          value={hisabado}
                          onChange={setHisabado}
                        />
                        <TimeInput
                          isDisabled={!sabado}
                          value={hfsabado}
                          onChange={setHfsabado}
                        />
                      </div>
                    </div>
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

export default ModificarHorario;
