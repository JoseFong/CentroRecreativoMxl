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
  TimeInput,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Dia {
  nombre: string;
  inicio: string;
  fin: string;
}

interface Horario {
  dias: Dia[];
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

  useEffect(() => {
    setEnviado(false);
    setCargando(true);
    fetchGruposDisponibles();
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

      let horario = "";

      if (lunes) {
        const partes1 = hilunes.toString().split(":");
        const partes2 = hflunes.toString().split(":");
        const i = partes1[0] + ":" + partes1[1];
        const f = partes2[0] + ":" + partes2[1];
        horario += "lunes." + i + "." + f + "..";
      }

      if (martes) {
        const partes1 = himartes.toString().split(":");
        const partes2 = hfmartes.toString().split(":");
        const i = partes1[0] + ":" + partes1[1];
        const f = partes2[0] + ":" + partes2[1];
        horario += "martes." + i + "." + f + "..";
      }

      if (miercoles) {
        const partes1 = himiercoles.toString().split(":");
        const partes2 = hfmiercoles.toString().split(":");
        const i = partes1[0] + ":" + partes1[1];
        const f = partes2[0] + ":" + partes2[1];
        horario += "miercoles." + i + "." + f + "..";
      }

      if (jueves) {
        const partes1 = hijueves.toString().split(":");
        const partes2 = hfjueves.toString().split(":");
        const i = partes1[0] + ":" + partes1[1];
        const f = partes2[0] + ":" + partes2[1];
        horario += "jueves." + i + "." + f + "..";
      }

      if (viernes) {
        const partes1 = hiviernes.toString().split(":");
        const partes2 = hfviernes.toString().split(":");
        const i = partes1[0] + ":" + partes1[1];
        const f = partes2[0] + ":" + partes2[1];
        horario += "viernes." + i + "." + f + "..";
      }

      if (sabado) {
        const partes1 = hisabado.toString().split(":");
        const partes2 = hfsabado.toString().split(":");
        const i = partes1[0] + ":" + partes1[1];
        const f = partes2[0] + ":" + partes2[1];
        horario += "sabado." + i + "." + f + "..";
      }
      horario = horario.slice(0, -2);
      asignar(horario);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const asignar = async (horario: string) => {
    const data = {
      horario: horario,
      grupoId: parseInt(grupoId),
      actividadId: actividad.id,
    };

    try {
      const response = await axios.post("/api/grupoAct", data);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Se asignó exitosamente el grupo.");
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

  const reset = () => {};

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
    </>
  );
}

export default AsignarGrupo;
