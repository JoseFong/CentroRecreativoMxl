"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import html2pdf from "html2pdf.js";

interface Dia {
  id: number;
  fecha: number;
}

interface Semana {
  dias: Dia[];
}

interface Evento {
  fecha: number;
  grupo: string;
  titulo: string;
}

function Calendario({
  isOpen,
  onOpenChange,
}: {
  isOpen: any;
  onOpenChange: any;
}) {
  const [salidas, setSalidas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [grupos, setGrupos] = useState([]);
  const [mesActual, setMesActual] = useState("");
  const [limit, setLimit] = useState<number>();
  const [empieza, setEmpieza] = useState<number>();
  const [weeks, setWeeks] = useState<Semana[]>([]);
  const [info, setInfo] = useState<Evento[]>([]);
  const [mesActualNum, setMesActualNum] = useState<number>();
  const [anoActual, setAnoActual] = useState<number>();

  const meses: string[] = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  useEffect(() => {
    setCargando(true);
    fetchActividades();
    fetchGrupos();
    const dateToday = new Date();
    const m = dateToday.getMonth() + 1;
    setMesActualNum(m);
    setAnoActual(dateToday.getFullYear());
    setMesActual(meses[m - 1]);
    if (
      m === 1 ||
      m === 3 ||
      m === 5 ||
      m === 7 ||
      m === 8 ||
      m === 10 ||
      m === 12
    ) {
      setLimit(31);
    }
    if (m === 2) {
      if (dateToday.getFullYear() % 4 === 0) {
        setLimit(29);
      } else {
        setLimit(28);
      }
    }
    if (m === 4 || m === 6 || m === 9 || m === 11) {
      setLimit(30);
    }
    const firstDate = new Date(
      dateToday.getFullYear(),
      dateToday.getMonth(),
      1
    );
    const d = firstDate.toString().split(" ");
    if (d[0] === "Mon") setEmpieza(1);
    if (d[0] === "Tue") setEmpieza(2);
    if (d[0] === "Wed") setEmpieza(3);
    if (d[0] === "Thu") setEmpieza(4);
    if (d[0] === "Fri") setEmpieza(5);
    if (d[0] === "Sat") setEmpieza(6);
    if (d[0] === "Sun") setEmpieza(0);

    let cont = 1;
    let dias: Dia[] = [];
    let open = false;
    let semanas: Semana[] = [];
    for (let i = 0; i < 35; i++) {
      if (i === empieza) {
        open = true;
      }
      if (cont === limit + 1) open = false;
      if (open) {
        const dia: Dia = { id: i, fecha: cont };
        dias.push(dia);
        cont++;
      } else {
        const dia: Dia = { id: i, fecha: -1 };
        dias.push(dia);
      }
      if (i === 6 || i === 13 || i === 20 || i === 27 || i === 34) {
        const semana: Semana = { dias: dias };
        semanas.push(semana);
        dias = [];
      }
    }
    setWeeks(semanas);
  }, [onOpenChange]);

  const fetchActividades = async () => {
    try {
      const response = await axios.get("/api/salidas");
      if (response.status >= 200 && response.status < 300) {
        setSalidas(response.data);
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

  const fetchGrupos = async () => {
    try {
      const response = await axios.get("/api/grupos");
      if (response.status >= 200 && response.status < 300) {
        setGrupos(response.data);
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
    if (grupos && salidas) {
      let ss: Evento[] = [];
      salidas.map((s: any) => {
        const partes = s.fecha.split("-");
        if (
          parseInt(partes[1]) === mesActualNum &&
          anoActual === parseInt(partes[0])
        ) {
          const f: number = parseInt(partes[2]);
          const salida: Evento = {
            grupo: nombreGrupo(s.grupoId),
            titulo: s.nombre,
            fecha: f,
          };
          ss.push(salida);
        }
      });
      setInfo(ss);
      setCargando(false);
    }
  }, [salidas, grupos]);

  const nombreGrupo = (id: number) => {
    const grupo = grupos.find((gr: any) => gr.id === id);
    if (!grupo) return null;
    return grupo.nombre;
  };

  const generarPDF = () => {
    const element = document.getElementById("imprimir");
    const opt = {
      margin: 10,
      filename: `Calendario_${mesActual}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader></ModalHeader>
              <ModalBody>
                {cargando ? (
                  <Spinner size="lg" />
                ) : (
                  <div className="text-sm" id="imprimir">
                    <h1 className="mb-1 font-bold text-center">
                      Calendario del mes de {mesActual}
                    </h1>
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="border-1 border-black text-center w-24 h-10">
                            Domingo
                          </th>
                          <th className="border-1 border-black text-center w-24">
                            Lunes
                          </th>
                          <th className="border-1 border-black text-center w-24">
                            Martes
                          </th>
                          <th className="border-1 border-black text-center w-24">
                            Miércoles
                          </th>
                          <th className="border-1 border-black text-center w-24">
                            Jueves
                          </th>
                          <th className="border-1 border-black text-center w-24">
                            Viernes
                          </th>
                          <th className="border-1 border-black text-center w-24">
                            Sábado
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {weeks.map((w: Semana) => (
                          <tr>
                            {w.dias.map((d: Dia) => (
                              <td className="border-1 border-black h-24 p-1">
                                {d.fecha !== -1 && (
                                  <div className="flex flex-col h-full">
                                    <p className="text-right top-0">
                                      {d.fecha}
                                    </p>
                                    <div>
                                      {info.map((i: Evento) => (
                                        <>
                                          {i.fecha === d.fecha && (
                                            <p>
                                              {i.titulo} ({i.grupo})
                                            </p>
                                          )}
                                        </>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                {!cargando && (
                  <>
                    <Button onPress={generarPDF}>Imprimir</Button>
                    <Button onPress={onClose}>Cerrar</Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Calendario;
