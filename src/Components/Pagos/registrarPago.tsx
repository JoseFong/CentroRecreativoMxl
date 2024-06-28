import {
  ceroNegativo,
  fechaFutura,
  pagoDeOtroAno,
  textoVacio,
  tieneLetras,
} from "@/utils/validaciones";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function RegistrarPago({
  isOpen,
  onOpenChange,
  alumnos,
  fetchPagos,
}: {
  isOpen: any;
  onOpenChange: any;
  alumnos: any;
  fetchPagos: () => void;
}) {
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

  const [monto, setMonto] = useState("");
  const [alumnoId, setAlumnoId] = useState("");
  const [folio, setFolio] = useState("");
  const [fecha, setFecha] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [enviado, setEnviado] = useState(false);

  const [otr, setOtr] = useState(false);
  const [mens, setMens] = useState(false);
  const [mat, setMat] = useState(false);

  const [data, setData] = useState();

  const {
    isOpen: isConfOpen,
    onOpen: onConfOpen,
    onOpenChange: onConfOpenChange,
  } = useDisclosure();

  useEffect(() => {
    setDescripcion("");
    setOtr(false);
    setMens(false);
    setMat(false);
    if (categoria === "Otro") setOtr(true);
    if (categoria === "Mensualidad") setMens(true);
    if (categoria === "Materiales") setMat(true);
  }, [categoria]);

  const handleRegistrar = () => {
    setEnviado(true);
    try {
      if (
        textoVacio(alumnoId) ||
        textoVacio(monto) ||
        textoVacio(folio) ||
        textoVacio(fecha) ||
        textoVacio(categoria)
      )
        throw new Error("No deje campos vacíos.");

      if (ceroNegativo(monto) || tieneLetras(monto))
        throw new Error("Ingrese un monto válido.");

      if (fechaFutura(fecha))
        throw new Error("No puede ingresar fechas futuras a la fecha actual.");

      if (pagoDeOtroAno(fecha))
        throw new Error("No puede registrar pagos de otros años.");

      if (categoria === "Mensualidad") {
        if (textoVacio(descripcion)) throw new Error("Seleccione un mes.");
      }

      if (categoria === "Otro") {
        if (textoVacio(descripcion))
          throw new Error("Ingrese una descripción del pago.");
      }

      const partes = fecha.split("-");
      const fechaForm = partes[2] + "/" + partes[1] + "/" + partes[0];

      const dataTemp = {
        alumnoId: parseInt(alumnoId),
        monto: parseFloat(monto),
        folio: folio.trim().toUpperCase(),
        fecha: fechaForm,
        categoria: categoria,
        descripcion: descripcion,
      };

      setData(dataTemp);
      onConfOpen();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const obtenerNombreAlumno = (id: number) => {
    const alumno = alumnos.find((al: any) => al.id === id);
    if (alumno) return alumno.nombre + " " + alumno.aPaterno;
    return null;
  };

  const registrar = async (onClose2: any) => {
    try {
      const response = await axios.post("/api/pagos", data);
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchPagos();
        reset();
        onClose2();
        onOpenChange(false);
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (e.response) {
        const sE = e.response.status;
        if (sE === 404 || sE === 500 || sE == 400) {
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
    setMonto("");
    setFecha("");
    setCategoria("");
    setEnviado(false);
    setDescripcion("");
    setFolio("");
    setAlumnoId("");
  };

  useEffect(() => {
    reset();
  }, [isOpen, onOpenChange]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Registrar Pago</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <Select
                    label="Alumno"
                    placeholder="Alumno"
                    isDisabled={alumnos.length === 0}
                    labelPlacement="outside"
                    onChange={(e) => setAlumnoId(e.target.value)}
                    isRequired
                    isInvalid={enviado && textoVacio(alumnoId)}
                  >
                    {alumnos.map((al: any) => (
                      <SelectItem key={al.id} value={al.id}>
                        {al.nombre} {al.aPaterno}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    type="number"
                    label="Monto"
                    labelPlacement="outside"
                    placeholder="$"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'e' || e.key === 'E') {
                        e.preventDefault();
                      }
                    }}
                    isRequired
                    isInvalid={
                      enviado &&
                      (textoVacio(monto) ||
                        tieneLetras(monto) ||
                        ceroNegativo(monto))
                    }
                  />
                  <Input
                    type="text"
                    label="Folio"
                    labelPlacement="outside"
                    placeholder="Folio"
                    value={folio}
                    onChange={(e) => setFolio(e.target.value)}
                    isRequired
                    isInvalid={enviado && textoVacio(folio)}
                  />
                  <Input
                    type="date"
                    label="Fecha"
                    labelPlacement="outside"
                    value={fecha}
                    isRequired
                    isInvalid={
                      enviado &&
                      (textoVacio(fecha) ||
                        fechaFutura(fecha) ||
                        pagoDeOtroAno(fecha))
                    }
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </div>
                <Select
                  label="Categoría"
                  labelPlacement="outside"
                  placeholder="Categoría"
                  value={categoria}
                  isRequired
                  isInvalid={enviado && textoVacio(categoria)}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <SelectItem key={"Inscripcion"}>Inscripcion</SelectItem>
                  <SelectItem key={"Materiales"}>Materiales</SelectItem>
                  <SelectItem key={"Mensualidad"}>Mensualidad</SelectItem>
                  <SelectItem key={"Otro"}>Otro</SelectItem>
                </Select>
                {otr && (
                  <Textarea
                    type="text"
                    label="Descripcion"
                    labelPlacement="outside"
                    placeholder="Descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    isRequired
                    isInvalid={enviado && textoVacio(descripcion)}
                  />
                )}

                {mens && (
                  <Select
                    label="Mes"
                    labelPlacement="outside"
                    placeholder="Mes"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    isRequired
                    isInvalid={enviado && textoVacio(descripcion)}
                  >
                    {meses.map((mes: string) => (
                      <SelectItem key={mes}>{mes}</SelectItem>
                    ))}
                  </Select>
                )}

                {mat && (
                  <Textarea
                    type="text"
                    label="Materiales"
                    labelPlacement="outside"
                    placeholder="Materiales"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose} className="bg-verde">Cancelar</Button>
                <Button onPress={handleRegistrar} className=" bg-verdeFuerte text-[#ffffff]">Registrar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {data && (
        <Modal isOpen={isConfOpen} onOpenChange={onConfOpenChange}>
          <ModalContent>
            {(onClose2) => (
              <>
                <ModalHeader>
                  ¿Seguro que quiere registrar el siguiente pago?
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col">
                    <p>
                      <span className="font-bold">Alumno: </span>
                      {obtenerNombreAlumno(data.alumnoId)}
                    </p>
                    <p>
                      <span className="font-bold">Monto: </span>
                      {monto}
                    </p>
                    <p>
                      <span className="font-bold">Folio: </span>
                      {folio}
                    </p>
                    <p>
                      <span className="font-bold">Fecha: </span>
                      {data.fecha}
                    </p>
                    <p>
                      <span className="font-bold">Categoría: </span>
                      {categoria}
                    </p>
                    {descripcion !== "" && (
                      <p>
                        <span className="font-bold">Detalles: </span>
                        {descripcion}
                      </p>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button onPress={onClose2} className="bg-verde">Cancelar</Button>
                  <Button onPress={() => registrar(onClose2)} className=" bg-verdeFuerte text-[#ffffff]">Aceptar</Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default RegistrarPago;
