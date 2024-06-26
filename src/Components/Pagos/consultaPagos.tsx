import {
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
import { Pago, Alumno } from "@prisma/client";

interface AlumnosPago {
  alumno: string;
  otros: Pago[];
  inscripcion: Pago;
  mensualidades: Pago[];
  materiales: Pago[];
}

function ConsultaPagos() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [cargando, setCargando] = useState(true);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [alumnoPagos, setAlumnoPagos] = useState<AlumnosPago[]>([]);

  useEffect(() => {
    fetchAlumnos();
    fetchPagos();
  }, []);

  useEffect(() => {
    if (pagos.length > 0 && alumnos.length > 0) {
      let registros: AlumnosPago[] = [];
      alumnos.map((alumno: Alumno) => {
        const id = alumno.id;
        const pagosDeAlumno: Pago[] = pagos.filter(
          (pag: any) => pag.alumnoId === id
        );
        const pagoIns: Pago = pagosDeAlumno.find(
          (pag: Pago) => pag.categoria === "Inscripcion"
        );
        const pagosMens = pagosDeAlumno.filter(
          (pag: Pago) => pag.categoria === "Mensualidad"
        );
        const pagosMat = pagosDeAlumno.filter(
          (pag: Pago) => pag.categoria === "Materiales"
        );
        const pagosOtros = pagosDeAlumno.filter(
          (pag: Pago) => pag.categoria === "Otro"
        );
        const nombre = alumno.nombre + " " + alumno.aPaterno;
        const registro: AlumnosPago = {
          alumno: nombre,
          inscripcion: pagoIns,
          mensualidades: pagosMens,
          materiales: pagosMat,
          otros: pagosOtros,
        };
        registros.push(registro);
      });
      setAlumnoPagos(registros);
      setCargando(false);
    }
  }, [pagos, alumnos]);

  const fetchAlumnos = async () => {
    try {
      const response = await axios.get("/api/alumnos");
      if (response.status >= 200 && response.status < 300) {
        setAlumnos(response.data);
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (e.response) {
        if (
          e.response.status === 404 ||
          e.response.status === 500 ||
          e.response.status === 400
        ) {
          toast.error(e.response.data.message);
        } else {
          toast.error(e.message);
        }
      } else {
        toast.error(e.message);
      }
    }
  };

  const fetchPagos = async () => {
    try {
      const response = await axios.get("/api/pagos");
      if (response.status >= 200 && response.status < 300) {
        setPagos(response.data);
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (e.response) {
        if (e.response.status === 404 || e.response.status === 500) {
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
      Lista de pagos
      {cargando ? (
        <Spinner size="lg" />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableColumn>Alumno</TableColumn>
              <TableColumn>Inscripcion</TableColumn>
              <TableColumn>Materiales</TableColumn>
              <TableColumn>Mensualidades</TableColumn>
              <TableColumn>Otros</TableColumn>
            </TableHeader>
            <TableBody>
              {alumnoPagos.map((alp: AlumnosPago) => (
                <TableRow>
                  <TableCell>{alp.alumno}</TableCell>
                  <TableCell>
                    {alp.inscripcion && alp.inscripcion.cantidad > 0 ? (
                      <p>PAGADO</p>
                    ) : (
                      <p>NO HA PAGADO</p>
                    )}
                  </TableCell>
                  <TableCell>{alp.materiales.length}/2</TableCell>
                  <TableCell>{alp.mensualidades.length}/12</TableCell>
                  <TableCell>Ver otros ({alp.otros.length})</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
}

export default ConsultaPagos;
