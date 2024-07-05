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
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmarRegistrarAlumno from "./confirmarRegistrarAlumno";
import {
  fechaFutura,
  telefonoInvalido,
  textoVacio,
  tieneCaracteresEspeciales,
  tieneNumeros,
} from "@/utils/validaciones";

function RegistrarAlumno({
  isOpen,
  onOpenChange,
  nees,
  grupos,
  fetchAlumnos,
}: {
  isOpen: any;
  onOpenChange: any;
  nees: any;
  grupos: any;
  fetchAlumnos: () => void;
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
  const [data, setData] = useState(); //Aqui se va a guardar toda la información en conjunto
  const [grupoId, setGrupoId] = useState("");

  const [ids, setIds] = useState<number[]>([]);
  const [nombres, setNombres] = useState<string[]>([]);

  //useState para verificar si ya se presionó el botón de agregar
  const [enviado, setEnviado] = useState(false);

  //Variables para controlar el modal de confirmación de registro del alumno
  const {
    onOpen: onConfirmarOpen,
    isOpen: isConfirmarOpen,
    onOpenChange: onConfirmarOpenChange,
  } = useDisclosure();

  //Función para agregar el alumno, se ejecuta cuando se presiona registrar
  const handleAgregar = () => {
    try {
      setEnviado(true); //Se declara enviado como true

      if (
        textoVacio(nombre) ||
        textoVacio(aPaterno) ||
        textoVacio(aMaterno) ||
        textoVacio(fechaNac) ||
        textoVacio(genero) ||
        textoVacio(telefono) ||
        textoVacio(direccion) ||
        textoVacio(curp)
      ) {
        throw new Error("No deje campos vacíos.");
      }

      if (
        tieneNumeros(nombre) ||
        tieneNumeros(aPaterno) ||
        tieneNumeros(aMaterno)
      )
        throw new Error("El nombre no puede contener números.");

      if (
        tieneCaracteresEspeciales(nombre) ||
        tieneCaracteresEspeciales(aPaterno) ||
        tieneCaracteresEspeciales(aMaterno)
      ) {
        throw new Error("El nombre no puede tener caracteres especiales.");
      }

      if (fechaFutura(fechaNac))
        throw new Error("No puede ingresar una fecha de nacimiento futura.");

      if (telefonoInvalido(telefono))
        throw new Error("Ingrese un teléfono válido.");

      if (telefonoAl.length > 0 && telefonoInvalido(telefonoAl))
        throw new Error("Ingrese un teléfono válido.");

      if (curp.trim().length !== 18)
        throw new Error("Ingrese una CURP con un formáto correcto.");

      if (ids.length === 0)
        throw new Error("Seleccione al menos una neurodivergencia.");

      let nee: string = "";

      for (let i = 0; i < ids.length; i++) {
        nee = nee + ids[i];
        if (i !== ids.length - 1) {
          nee = nee + ",";
        }
      }

      //Si se llega a este punto es que no hay errores con los datos ingresados
      //Se agrega toda la información en un objeto dataTemp
      const dataTemp = {
        nombre: nombre.trim().toUpperCase(),
        aPaterno: aPaterno.trim().toUpperCase(),
        aMaterno: aMaterno.trim().toUpperCase(),
        genero: genero.trim(),
        fechaNac: fechaNac.trim(),
        telefono: telefono.trim(),
        telefonoAl: telefonoAl.trim(),
        direccion: direccion.trim().toUpperCase(),
        curp: curp.trim().toUpperCase(),
        nee,
        grupoId,
      };

      //Se le pasa la información de dataTemp a data
      setData(dataTemp);

      //Se abre el modal para confirmar el registro
      onConfirmarOpen();
    } catch (e: any) {
      toast.error(e.message);
    }
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
    setEnviado(false);
    setIds([]);
    setGrupoId("");
    setNombres([]);
  };

  const agregarNEE = (id: number, nombre: string) => {
    const index = ids.indexOf(id);
    if (index === -1) {
      setIds([...ids, id]);
      setNombres([...nombres, nombre]);
    } else {
      setIds(ids.filter((idtemp) => idtemp !== id));
      setNombres(nombres.filter((nombretemp) => nombretemp !== nombre));
    }
  };

  const selectAll = () => {
    if (nees.length === ids.length) {
      setIds([]);
      setNombres([]);
    } else {
      setIds(nees.map((nee: any) => nee.id));
      setNombres(nees.map((nee: any) => nee.nombre));
    }
  };

  //CONTENIDO: Formulario para registrar la información del alumno.
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="4xl"
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center justify-center">
                Registrar Alumno
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-5 md:flex-row ">
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
                        isInvalid={
                          enviado &&
                          (textoVacio(nombre) ||
                            tieneCaracteresEspeciales(nombre) ||
                            tieneNumeros(nombre))
                        }
                        value={nombre}
                        onValueChange={setNombre}
                      />
                      <Input
                        isRequired
                        type="text"
                        label="Apellido Paterno"
                        labelPlacement="outside"
                        placeholder="Ej. Pérez"
                        isInvalid={
                          enviado &&
                          (textoVacio(aPaterno) ||
                            tieneCaracteresEspeciales(aPaterno) ||
                            tieneNumeros(aPaterno))
                        }
                        value={aPaterno}
                        onValueChange={setAPaterno}
                      />
                      <Input
                        type="text"
                        label="Apellido Materno"
                        labelPlacement="outside"
                        placeholder="Ej. López"
                        isInvalid={
                          enviado &&
                          (textoVacio(aMaterno) ||
                            tieneCaracteresEspeciales(aMaterno) ||
                            tieneNumeros(aMaterno))
                        }
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
                            enviado &&
                            (textoVacio(fechaNac) || fechaFutura(fechaNac))
                          }
                        />
                      </div>
                      <Select
                        isRequired
                        label="Género"
                        labelPlacement="outside"
                        placeholder="Género"
                        value={genero}
                        isInvalid={enviado && textoVacio(genero)}
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
                          (telefonoInvalido(telefono) || textoVacio(telefono))
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
                          !textoVacio(telefonoAl) &&
                          telefonoInvalido(telefonoAl)
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
                      isInvalid={enviado && textoVacio(direccion)}
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
                    <div className=" bg-slate-50 rounded-xl p-3 md:w-auto w-44">
                      <h1 className="font-bold mb-2">Neurodivergencias</h1>
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
                    <div className="flex w-72">
                      <Select
                        label="Grupo (Opcional)"
                        labelPlacement="outside"
                        placeholder="Grupo"
                        value={grupoId}
                        onChange={(e) => setGrupoId(e.target.value)}
                        className="mt-8 w-full"
                        isDisabled={grupos.length === 0}
                        defaultSelectedKeys={[parseInt(grupoId)]}
                      >
                        {grupos.map((grupo: any) => (
                          <SelectItem key={grupo.id} value={grupo.id}>
                            {grupo.nombre}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row gap-1">
                  <Button onPress={onClose} className="bg-verde">
                    Cancelar
                  </Button>
                  <Button
                    onPress={handleAgregar}
                    className=" bg-verdeFuerte text-[#ffffff]"
                  >
                    Registrar
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ConfirmarRegistrarAlumno
        data={data}
        isOpen={isConfirmarOpen}
        onOpenChange={onConfirmarOpenChange}
        nees={nombres}
        fetchAlumnos={fetchAlumnos}
        reset={reset}
        grupos={grupos}
      />
    </>
  );
}

export default RegistrarAlumno;
