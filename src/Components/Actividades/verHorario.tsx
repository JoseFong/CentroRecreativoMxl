import {
  Button,
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
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GrupoActividad } from "@prisma/client";
import { primerLetra } from "@/utils/validaciones";

function VerHorario({
  grupo,
  actividad,
  isOpen,
  onOpenChange,
}: {
  grupo: any;
  actividad: any;
  isOpen: any;
  onOpenChange: any;
}) {
  return (
    <>
      {grupo && actividad && (
        <VerHorarioModal
          grupo={grupo}
          actividad={actividad}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
    </>
  );
}

function VerHorarioModal({
  grupo,
  actividad,
  isOpen,
  onOpenChange,
}: {
  grupo: any;
  actividad: any;
  isOpen: any;
  onOpenChange: any;
}) {
  interface Dia {
    nombre: string;
    inicio: string;
    fin: string;
  }

  const [cargando, setCargando] = useState(true);
  const [info, setInfo] = useState<GrupoActividad>();
  const [display, setDisplay] = useState<Dia[]>([]);

  let dias: Dia[] = [];

  useEffect(() => {
    dias = [];
    if (info) {
      const horario = info.horario;
      const ds = horario.split("..");
      ds.map((d: string) => {
        const p = d.split(".");
        const dia: Dia = { nombre: p[0], inicio: p[1], fin: p[2] };
        dias.push(dia);
      });
      setDisplay(dias);
    }
  }, [info]);

  useEffect(() => {
    setCargando(true);
    fetchHorario();
  }, [grupo, actividad]);

  const fetchHorario = async () => {
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
        setInfo(response.data);
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

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                Horario de {actividad.nombre} en el grupo {grupo.nombre}
              </ModalHeader>
              <ModalBody>
                {cargando ? (
                  <Spinner size="lg" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableColumn>Día</TableColumn>
                      <TableColumn>Inicio</TableColumn>
                      <TableColumn>Fin</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {display?.map((d: Dia) => (
                        <TableRow>
                          <TableCell>{primerLetra(d.nombre)}</TableCell>
                          <TableCell>{d.inicio}</TableCell>
                          <TableCell>{d.fin}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
