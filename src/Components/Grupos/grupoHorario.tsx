import { primerLetra } from "@/utils/validaciones";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function VerHorario({
  isOpen,
  onOpenChange,
  grupo,
}: {
  isOpen: any;
  onOpenChange: any;
  grupo: any;
}) {
  return (
    <>
      {grupo && (
        <VerHorarioModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          grupo={grupo}
        />
      )}
    </>
  );
}

interface Dia {
  nombre: string;
  inicio: string;
  fin: string;
}

interface Horario {
  clase: string;
  dias: Dia[];
}

function VerHorarioModal({
  isOpen,
  onOpenChange,
  grupo,
}: {
  isOpen: any;
  onOpenChange: any;
  grupo: any;
}) {
  const [cargando, setCargando] = useState(true);
  const [info, setInfo] = useState([]);
  const [display, setDisplay] = useState<Horario[]>([]);
  const [clases, setClases] = useState([]);

  useEffect(() => {
    setCargando(true);
  }, []);

  useEffect(() => {
    setCargando(true);
    if (grupo) {
      fetchActividades();
      fetchClases();
    }
  }, [grupo, isOpen, onOpenChange]);

  const fetchActividades = async () => {
    try {
      const response = await axios.get(
        "/api/grupoAct/grupoActDeGrupo/" + grupo.id
      );
      if (response.status >= 200 && response.status < 300) {
        setInfo(response.data);
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

  const dias: string[] = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
  ];

  const fetchClases = async () => {
    try {
      const response = await axios.get("/api/actividades");
      if (response.status >= 200 && response.status < 300) {
        setClases(response.data);
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

  useEffect(() => {
    if (info && clases) {
      let hs: Horario[] = [];
      info.map((i: any) => {
        let ds: Dia[] = [];
        const horario = JSON.parse(i.horario);
        for (let dia of dias) {
          if (horario[dia]) {
            const d: Dia = {
              nombre: primerLetra(dia),
              inicio: horario[dia].inicio,
              fin: horario[dia].fin,
            };
            ds.push(d);
          }
        }
        const h: Horario = { clase: nombreClase(i.actividadId), dias: ds };
        hs.push(h);
      });
      setDisplay(hs);
      setCargando(false);
    }
  }, [info, clases]);

  const nombreClase = (n: number) => {
    const clase = clases.find((cl: any) => cl.id === n);
    if (!clase) return null;
    return clase.nombre;
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Horario de grupo '{grupo.nombre}'</ModalHeader>
              <ModalBody>
                {cargando ? (
                  <Spinner size="lg" />
                ) : (
                  <>
                    {info.length === 0 ? (
                      <p>El grupo no tiene actividades.</p>
                    ) : (
                      <>
                        <table>
                          <thead>
                            <tr>
                              <th className="border-1 border-black">
                                Actividad
                              </th>
                              <th className="border-1 border-black">Día</th>
                              <th className="border-1 border-black">Inicio</th>
                              <th className="border-1 border-black">Fin</th>
                            </tr>
                          </thead>
                          <tbody>
                            {display.map((h: Horario) => (
                              <>
                                {h.dias.map((d: Dia, index: number) => (
                                  <tr>
                                    {index === 0 && (
                                      <td
                                        rowSpan={h.dias.length}
                                        className="border-1 border-black text-center"
                                      >
                                        {h.clase}
                                      </td>
                                    )}
                                    <td className="border-1 border-black text-center">
                                      {d.nombre}
                                    </td>
                                    <td className="border-1 border-black text-center">
                                      {d.inicio}
                                    </td>
                                    <td className="border-1 border-black text-center">
                                      {d.fin}
                                    </td>
                                  </tr>
                                ))}
                              </>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Cerrar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default VerHorario;
