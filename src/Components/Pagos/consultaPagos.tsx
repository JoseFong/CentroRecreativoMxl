import {
  Button,
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
import { Pago, Alumno } from "@prisma/client";
import ListadoPagos from "./listadoPagos";
import ConsultaInscripcion from "./consultaInscripcion";
import RegistrarPago from "./registrarPago";

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

  const [selectedPagos, setSelectedPagos] = useState<Pago[]>([]);
  const [selectedAlumno, setSelectedAlumno] = useState("");
  const [tipo, setTipo] = useState("");
  const [selectedPago, setSelectedPago] = useState<Pago>();

  const {
    isOpen: isMultOpen,
    onOpenChange: onMultOpenChange,
    onOpen: onMultOpen,
  } = useDisclosure();

  const {
    isOpen: isInsOpen,
    onOpenChange: onInsOpenChange,
    onOpen: onInsOpen,
  } = useDisclosure();

  const {
    isOpen: isRegOpen,
    onOpenChange: onRegOpenChange,
    onOpen: onRegOpen,
  } = useDisclosure();

  useEffect(() => {
    fetchAlumnos();
    fetchPagos();
  }, []);

  useEffect(() => {
    if (pagos && alumnos) {
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

  const handleVerPagos = (t: string, pagos: Pago[], alumno: string) => {
    setTipo(t);
    setSelectedAlumno(alumno);
    setSelectedPagos(pagos);
    onMultOpen();
  };

  const handleVerInscripcion = (alumno: string, pago: Pago) => {
    setSelectedAlumno(alumno);
    setSelectedPago(pago);
    onInsOpen();
  };

  const handleRegistrarPago = () => {
    onRegOpen();
  };

  return (
    <>
      Lista de pagos
      <Button onPress={handleRegistrarPago}>Registrar pago</Button>
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
                      <Button
                        onPress={() =>
                          handleVerInscripcion(alp.alumno, alp.inscripcion)
                        }
                      >
                        PAGADO
                      </Button>
                    ) : (
                      <p>NO HA PAGADO</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      onPress={() =>
                        handleVerPagos("Materiales", alp.materiales, alp.alumno)
                      }
                    >
                      {alp.materiales.length}/2
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      onPress={() =>
                        handleVerPagos(
                          "Mensualidades",
                          alp.mensualidades,
                          alp.alumno
                        )
                      }
                    >
                      {alp.mensualidades.length}/12
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      onPress={() =>
                        handleVerPagos("Otros", alp.otros, alp.alumno)
                      }
                    >
                      Ver otros ({alp.otros.length})
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
      <ListadoPagos
        isOpen={isMultOpen}
        onOpenChange={onMultOpenChange}
        tipo={tipo}
        alumno={selectedAlumno}
        pagos={selectedPagos}
        fetchPagos={fetchPagos}
      />
      <ConsultaInscripcion
        isOpen={isInsOpen}
        onOpenChange={onInsOpenChange}
        pago={selectedPago}
        alumno={selectedAlumno}
        fetchPagos={fetchPagos}
      />
      <RegistrarPago
        isOpen={isRegOpen}
        onOpenChange={onRegOpenChange}
        alumnos={alumnos}
        fetchPagos={fetchPagos}
      />
    </>
  );
}

export default ConsultaPagos;
