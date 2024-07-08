import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
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
import ConfirmarModificarAlumno from "./confirmarModificarAlumno";
import { Grupo } from "@prisma/client";

function ModificarAlumno({
  alumno,
  onOpenChange,
  isOpen,
  nees,
  fetchAlumnos,
  grupos,
}: {
  alumno: any;
  onOpenChange: any;
  isOpen: any;
  nees: any;
  fetchAlumnos: () => void;
  grupos: Grupo[];
}) {
  return (
    <>
      {alumno && (
        <ComponenteModAlumno
          alumno={alumno}
          onOpenChange={onOpenChange}
          isOpen={isOpen}
          nees={nees}
          fetchAlumnos={fetchAlumnos}
          grupos={grupos}
        />
      )}
    </>
  );
}

function ComponenteModAlumno({
  alumno,
  onOpenChange,
  isOpen,
  nees,
  fetchAlumnos,
  grupos,
}: {
  alumno: any;
  onOpenChange: any;
  isOpen: any;
  nees: any;
  fetchAlumnos: () => void;
  grupos: Grupo[];
}) {
  //useStates para guardar la información del alumno a registrar
  const [nombre, setNombre] = useState(alumno.nombre);
  const [aPaterno, setAPaterno] = useState(alumno.aPaterno);
  const [aMaterno, setAMaterno] = useState(alumno.aMaterno);
  const [genero, setGenero] = useState(alumno.genero);
  const [fechaNac, setFechaNac] = useState("");
  const [telefono, setTelefono] = useState(alumno.telefono);
  const [telefonoAl, setTelefonoAl] = useState(alumno.telefonoAlumno);
  const [direccion, setDireccion] = useState(alumno.direccion);
  const [curp, setCurp] = useState(alumno.curp);
  const [data, setData] = useState(); //Aqui se va a guardar toda la información en conjunto
  const [grupoId, setGrupoId] = useState<string>(alumno.grupoId);

  const [nombreGrupo, setNombreGrupo] = useState("");

  const [ids, setIds] = useState<number[]>([]);
  const [nombres, setNombres] = useState<string[]>([]);

  //useState para verificar si ya se presionó el botón de agregar
  const [enviado, setEnviado] = useState(false);

  //useState para verificar si hay errores en la fecha o no
  const [errorFecha, setErrorFecha] = useState(false);

  //useState para almacenar las NEEs del alumno
  const [neesDeAlumno, setNeesDeAlumno] = useState([]);

  const [neesNombres, setNeesNombres] = useState("");

  //Variables para controlar el modal de confirmación de registro del alumno
  const {
    onOpen: onConfirmarOpen,
    isOpen: isConfirmarOpen,
    onOpenChange: onConfirmarOpenChange,
  } = useDisclosure();

  //se ejecuta cuando se abre el modal y cuando se selecciona otro alumno
  useEffect(() => {
    reset(); //Se ejecuta la función reset
    setIds([]); //Se borran las ids de las NEEs
    setNombres([]); //Se borran los nombres de las NEEs

    //Se consigue la fecha de nacimiento del alumno y se formatea para que aparezca en el input de tipo date
    const partes = alumno.fechaNac.split("/");
    const fecha = partes[2] + "-" + partes[1] + "-" + partes[0];
    setFechaNac(fecha);

    if (alumno.grupoId) {
      const grupo = grupos.find((gr: Grupo) => gr.id === alumno.grupoId);
      setNombreGrupo(grupo.nombre);
    } else {
      setNombreGrupo("Sin grupo");
    }

    fetchNeesDeAlumno(); //Se consiguen las NEEs del alumno
  }, [alumno, onOpenChange]);

  //Se ejecuta cuando cambien las NEEs del alumno, o sea cuando se consigan.
  useEffect(() => {
    //Si existen NEEs se asignan las ids y el nombre de dichas NEEs a los arreglos de ids y nombres
    if (neesDeAlumno.length > 0) {
      setIds(neesDeAlumno.map((nee: any) => nee.id));
      setNombres(neesDeAlumno.map((nee: any) => nee.nombre));
    }
  }, [neesDeAlumno]);

  //función para conseguir las NEEs de un alumno especifico
  const fetchNeesDeAlumno = async () => {
    try {
      const response = await axios.get("/api/nee/neesDeAlumno/" + alumno.id);
      if (response.status >= 200 && response.status < 300) {
        setNeesDeAlumno(response.data); //Se almacenan las NEEs
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

  //Regresa todo el formulario a la información actual del alumno
  const reset = () => {
    setNombre(alumno.nombre);
    setAMaterno(alumno.aMaterno);
    setAPaterno(alumno.aPaterno);
    setFechaNac(alumno.fechaNac);
    setGenero(alumno.genero);
    setTelefono(alumno.telefono);
    setTelefonoAl(alumno.telefonoAlumno);
    setDireccion(alumno.direccion);
    setCurp(alumno.curp);
  };

  //Función para modificat el alumno, se ejecuta cuando se presiona modificar
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
      curp.trim() === ""
    ) {
      toast.error("No deje campos en blanco.");
      return;
    }

    if (ids.length === 0) {
      toast.error("Seleccione al menos una neurodivergencia.");
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

    let nee: string = "";

    for (let i = 0; i < ids.length; i++) {
      nee = nee + ids[i];
      if (i !== ids.length - 1) {
        nee = nee + ",";
      }
    }

    const partes = fechaNac.split("-");
    const fechaForm = partes[2] + "/" + partes[1] + "/" + partes[0];

    let neesAEnviar: string = "";
    let nombresAEnviar: string = "";
    for (let i = 0; i < ids.length; i++) {
      neesAEnviar = neesAEnviar + ids[i].toString();
      nombresAEnviar = nombresAEnviar + nombres[i];
      if (i !== ids.length - 1) {
        neesAEnviar = neesAEnviar + ",";
        nombresAEnviar = nombresAEnviar + ", ";
      }
    }

    //Si se llega a este punto es que no hay errores con los datos ingresados
    //Se agrega toda la información en un objeto dataTemp
    const dataTemp = {
      id: alumno.id,
      nombre: nombre.trim().toUpperCase(),
      aPaterno: aPaterno.trim().toUpperCase(),
      aMaterno: aMaterno.trim().toUpperCase(),
      genero: genero.trim(),
      fechaNac: fechaForm,
      telefono: telefono.trim(),
      telefonoAl: telefonoAl.trim(),
      direccion: direccion.trim().toUpperCase(),
      curp: curp.trim().toUpperCase(),
      nee: neesAEnviar,
      grupoId,
    };

    setData(dataTemp);
    setNeesNombres(nombresAEnviar);
    onConfirmarOpen();
  };

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

  //Se ejecuta al presionar un checkbox de una nee
  const agregarNEE = (id: number, nombre: string) => {
    const index = ids.indexOf(id); //se obtiene el index de la id de la nee dentro del arreglo de ids

    if (index === -1) {
      //Si no está se agrega el id a las ids y el nombre a los nombres
      setIds([...ids, id]);
      setNombres([...nombres, nombre]);
    } else {
      //Si está, se quita de ambos arreglos
      setIds(ids.filter((idtemp) => idtemp !== id));
      setNombres(nombres.filter((nombretemp) => nombretemp !== nombre));
    }
  };

  //Se ejecuta al presionar el checbkox en la cabecera de la tabla, selecciona todas las nees
  const selectAll = () => {
    if (nees.length === ids.length) {
      //Si estan seleccionadas todas las deselecciona todas
      setIds([]);
      setNombres([]);
    } else {
      //Si no están seleccionadas todas, se seleccionan todas.
      setIds(nees.map((nee: any) => nee.id));
      setNombres(nees.map((nee: any) => nee.nombre));
    }
  };

  const handleCambioDeGrupo = (key: any) => {
    const id: number = parseInt(key);
    const grupo = grupos.find((gr: Grupo) => gr.id === id);
    setNombreGrupo(grupo.nombre);
    setGrupoId(key);
  };

  const handleDesasignarGrupo = () => {
    setGrupoId("");
    setNombreGrupo("Sin grupo");
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center justify-center pb-0 md:pb-3">
                Modificar información del alumno
              </ModalHeader>
              <ModalBody>
                <div className="flex gap-5 md:flex-row flex-col">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-center font-bold mb-4">
                      Información del alumno
                    </h1>
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
                        defaultSelectedKeys={[alumno.genero]}
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
                  </div>
                  <div className="flex flex-col gap-2 w-1/3 justify-center">
                    <div className="bg-slate-50 rounded-xl p-3 md:w-auto w-80">
                      <h1 className="font-bold text-center pb-3">
                        Neurodivergencias*
                      </h1>
                      <Table className="overflow-y-auto" removeWrapper>
                        <TableHeader>
                          <TableColumn>NEE</TableColumn>
                          <TableColumn>
                            <Checkbox
                              color="warning"
                              isSelected={nees.length === ids.length}
                              onChange={selectAll}
                            />
                          </TableColumn>
                        </TableHeader>
                        <TableBody>
                          {nees.map((nee: any) => (
                            <TableRow>
                              <TableCell>{nee.nombre}</TableCell>
                              <TableCell>
                                <Checkbox
                                  color="warning"
                                  isSelected={ids.includes(nee.id)}
                                  onChange={() =>
                                    agregarNEE(nee.id, nee.nombre)
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex flex-col gap-2 bg-slate-50 rounded-xl p-3 md:w-auto w-80">
                      <h1 className="font-bold text-center">Grupo asignado</h1>
                      <Input
                        isReadOnly
                        labelPlacement="outside"
                        placeholder="Grupo"
                        value={nombreGrupo}
                      />
                      <div className="flex flex-row">
                        <Button
                          className=" bg-verdeFuerte mr-3 text-[#ffffff]"
                          onPress={handleDesasignarGrupo}
                        >
                          Quitar grupo
                        </Button>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button className=" bg-verdeFuerte text-[#ffffff]">
                              Cambiar grupo
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            onAction={(key) => handleCambioDeGrupo(key)}
                          >
                            {grupos.map((gr: Grupo) => (
                              <DropdownItem key={gr.id}>
                                {gr.nombre}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row gap-1">
                  <Button onPress={onClose} className=" bg-verde">
                    Cancelar
                  </Button>
                  <Button
                    onPress={handleAgregar}
                    className=" bg-verdeFuerte text-[#ffffff]"
                  >
                    Modificar
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ConfirmarModificarAlumno
        isOpen={isConfirmarOpen}
        onOpenChange={onConfirmarOpenChange}
        data={data}
        nombres={neesNombres}
        fetchAlumnos={fetchAlumnos}
        nombreGrupo={nombreGrupo}
      />
    </>
  );
}

export default ModificarAlumno;
