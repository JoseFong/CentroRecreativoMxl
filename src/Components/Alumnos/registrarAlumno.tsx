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
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmarRegistrarAlumno from "./confirmarRegistrarAlumno";

function RegistrarAlumno({
  isOpen,
  onOpenChange,
  nees,
  fetchAlumnos,
  fetchNees,
}: {
  isOpen: any;
  onOpenChange: any;
  nees: any;
  fetchAlumnos: () => void;
  fetchNees: () => void;
}) {
  //useStates para guardar la información del alumno a registrar
  const [nombre, setNombre] = useState("");
  const [aPaterno, setAPaterno] = useState("");
  const [aMaterno, setAMaterno] = useState("");
  const [genero, setGenero] = useState("");
  const [fechaNac, setFechaNac] = useState("");
  const [telefono, setTelefono] = useState("");
  const [telefonoAl, setTelefonoAl] = useState("");
  const [direccion, setDireccion] = useState("");
  const [curp, setCurp] = useState("");
  const [nee, setNee] = useState("");
  const [data, setData] = useState(); //Aqui se va a guardar toda la información en conjunto

  //useState para verificar si ya se presionó el botón de agregar
  const [enviado, setEnviado] = useState(false);

  //useState para verificar si hay errores en la fecha o no
  const [errorFecha, setErrorFecha] = useState(false);

  //Variables para controlar el modal de confirmación de registro del alumno
  const {
    onOpen: onConfirmarOpen,
    isOpen: isConfirmarOpen,
    onOpenChange: onConfirmarOpenChange,
  } = useDisclosure();

  //Función para agregar el alumno, se ejecuta cuando se presiona registrar
  const handleAgregar = () => {
    setErrorFecha(false); //Se regresa el error de fecha a false

    setEnviado(true); //Se declara enviado como true

    //Validaciones para campos en blanco
    if (
      nombre.trim() === "" ||
      aPaterno.trim() === "" ||
      fechaNac.trim() === "" ||
      genero.trim() === "" ||
      telefono === "" ||
      direccion.trim() === "" ||
      curp.trim() === "" ||
      nee === ""
    ) {
      toast.error("No deje campos en blanco.");
      return;
    }

    //Validaciones para saber si el nombre tiene números.
    if (/\d/.test(nombre) || /\d/.test(aPaterno) || /\d/.test(aMaterno)) {
      toast.error("El nombre no puede contener números.");
      return;
    }

    //VALIDACIONES PARA FECHAS
    //Se parte la fecha en partes
    const [ano, mes, dia] = fechaNac.split("-");

    const fecha = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia)); //Se crea una fecha con la fecha ingresada
    const fechaHoy = new Date(); //Se crea una fecha con el día de hoy

    //Se verifica si la fecha de nacimiento es superior a la fecha actual
    if (fecha > fechaHoy) {
      toast.error("La fecha de nacimiento no puede superar la fecha actual.");
      setErrorFecha(true);
      return;
    }

    //Validación para saber si los teléfonos tienen letras
    if (
      /[a-z]/.test(telefono) ||
      /[a-z]/.test(telefonoAl) ||
      /[A-Z]/.test(telefono) ||
      /[A-Z]/.test(telefonoAl)
    ) {
      toast.error("El teléfono no puede contener letras.");
      return;
    }

    //validación para saber si la curp es de 18 caracteres
    if (curp.trim().length !== 18) {
      toast.error("Ingrese una CURP con formato correcto.");
      return;
    }

    //validaioón para longitud del telefono
    if (telefono.trim().length !== 10) {
      toast.error("Ingrese un teléfono con formato correcto.");
      return;
    }

    //validación para la longitud del telefono del alumno
    //agregue el telefonoAl.length>0 porque puede dejarse en blanco este espacio
    if (telefonoAl.length > 0 && telefonoAl.length !== 10) {
      toast.error("Ingrese un teléfono con formato correcto.");
      return;
    }

    //Si se llega a este punto es que no hay errores con los datos ingresados
    //Se agrega toda la información en un objeto dataTemp
    const dataTemp = {
      nombre: nombre.trim(),
      aPaterno: aPaterno.trim(),
      aMaterno: aMaterno.trim(),
      genero: genero.trim(),
      fechaNac: fechaNac.trim(),
      telefono: telefono.trim(),
      telefonoAl: telefonoAl.trim(),
      direccion: direccion.trim(),
      curp: curp.trim(),
      nee,
    };

    //Se le pasa la información de dataTemp a data
    setData(dataTemp);

    //Se abre el modal para confirmar el registro
    onConfirmarOpen();
  };

  //Esta función se ejecuta cuando se registra un alumno exitosamente
  //Vacia todo el formulario
  const reset = () => {
    setNombre("");
    setAPaterno("");
    setAMaterno("");
    setFechaNac("");
    setGenero("");
    setTelefono("");
    setTelefonoAl("");
    setDireccion("");
    setCurp("");
    setNee("");
    setEnviado(false);
  };

  //Valida textos para que no sean vacios y no tengan numeros
  const verificarTextos = (texto: string) => {
    if (texto.trim() === "") return true;
    if (/\d/.test(texto)) return true;
    return false;
  };

  //Valida textos para que no tengan numeros
  const verificarNumeros = (texto: string) => {
    if (/\d/.test(texto)) return true;
    return false;
  };

  //Valida strings para que no tengan letras ni mayusculas ni minusculas
  const verificarLetra = (texto: string) => {
    if (/[a-z]/.test(texto)) return true;
    if (/[A-Z]/.test(texto)) return true;
    return false;
  };

  //CONTENIDO: Formulario para registrar la información del alumno.
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Registrar Alumno</ModalHeader>
              <ModalBody>
                <div className="flex flex-row gap-2">
                  <Input
                    isRequired
                    type="text"
                    label="Nombre"
                    labelPlacement="outside"
                    placeholder="Ej. Juan"
                    isInvalid={enviado && verificarTextos(nombre)}
                    value={nombre}
                    onValueChange={setNombre}
                  />
                  <Input
                    isRequired
                    type="text"
                    label="Apellido Paterno"
                    labelPlacement="outside"
                    placeholder="Ej. Pérez"
                    isInvalid={enviado && verificarTextos(aPaterno)}
                    value={aPaterno}
                    onValueChange={setAPaterno}
                  />
                  <Input
                    type="text"
                    label="Apellido Materno"
                    labelPlacement="outside"
                    placeholder="Ej. López"
                    isInvalid={enviado && verificarNumeros(aMaterno)}
                    value={aMaterno}
                    onValueChange={setAMaterno}
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <div>
                    <label className="text-sm">Fecha de Nacimiento</label>
                    <Input
                      isRequired
                      className="mt-2"
                      type="date"
                      value={fechaNac}
                      onValueChange={setFechaNac}
                      isInvalid={
                        enviado && (fechaNac.trim() === "" || errorFecha)
                      }
                    />
                  </div>
                  <Select
                    isRequired
                    label="Género"
                    labelPlacement="outside"
                    placeholder="Género"
                    value={genero}
                    isInvalid={enviado && genero === ""}
                    onChange={(e) => setGenero(e.target.value)}
                  >
                    <SelectItem value={"Femenino"} key={"Femenino"}>
                      Femenino
                    </SelectItem>
                    <SelectItem value={"Masculino"} key={"Masculino"}>
                      Masculino
                    </SelectItem>
                    <SelectItem value={"Otro"} key={"Otro"}>
                      Otro
                    </SelectItem>
                  </Select>
                </div>
                <div className="flex flex-row gap-2">
                  <Input
                    isRequired
                    type="text"
                    label="Teléfono"
                    labelPlacement="outside"
                    placeholder="Ej. 6861234564"
                    isInvalid={
                      enviado &&
                      (verificarLetra(telefono) ||
                        telefono.trim() === "" ||
                        telefono.trim().length !== 10)
                    }
                    value={telefono}
                    onValueChange={setTelefono}
                  />
                  <Input
                    type="text"
                    label="Teléfono del alumno"
                    labelPlacement="outside"
                    placeholder="Ej. 6867894561"
                    isInvalid={
                      enviado &&
                      (verificarLetra(telefonoAl) ||
                        (telefonoAl.length > 0 && telefonoAl.length !== 10))
                    }
                    value={telefonoAl}
                    onValueChange={setTelefonoAl}
                  />
                </div>
                <Input
                  isRequired
                  type="text"
                  label="Dirección"
                  labelPlacement="outside"
                  placeholder="Dirección"
                  isInvalid={enviado && direccion.trim() === ""}
                  value={direccion}
                  onValueChange={setDireccion}
                />
                <Input
                  isRequired
                  type="text"
                  label="CURP"
                  labelPlacement="outside"
                  placeholder="CURP"
                  isInvalid={enviado && curp.trim().length !== 18}
                  value={curp}
                  onChange={(e) => setCurp(e.target.value.toUpperCase())}
                />
                <Select
                  isRequired
                  selectionMode="multiple"
                  placeholder="Neurodivergencia"
                  label="Neurodivergencia"
                  labelPlacement="outside"
                  isInvalid={enviado && nees.length !== 0 && nee === ""}
                  isDisabled={nees.length === 0}
                  value={nee}
                  onChange={(e) => setNee(e.target.value)}
                >
                  {nees.map((ne: any) => (
                    <SelectItem key={ne.id} value={ne.value}>
                      {ne.nombre}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row gap-1">
                  <Button onPress={handleAgregar} color="success">
                    Registrar
                  </Button>
                  <Button onPress={onClose}>Cancelar</Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ConfirmarRegistrarAlumno
        onOpen={onConfirmarOpen}
        isOpen={isConfirmarOpen}
        onOpenChange={onConfirmarOpenChange}
        data={data}
        nees={nees}
        nee={nee}
        fecha={fechaNac}
        fetchAlumnos={fetchAlumnos}
        reset={reset}
        fetchNees={fetchNees}
      />
    </>
  );
}

export default RegistrarAlumno;
