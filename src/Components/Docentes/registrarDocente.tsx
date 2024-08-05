import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  fechaFutura,
  telefonoInvalido,
  textoVacio,
  tieneCaracteresEspeciales,
  tieneNumeros,
} from "@/utils/validaciones";
import ConfirmarRegistro from "./confirmarRegistro";

function RegistrarDocente({ isOpen, onOpen, onOpenChange, setRefetch }: any) {
  const [nombre, setNombre] = useState("");
  const [aPaterno, setAPaterno] = useState("");
  const [aMaterno, setAMaterno] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNac, setFechaNac] = useState("");
  const [curp, setCurp] = useState("");
  const [correo, setCorreo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("");
  const [data, setData] = useState({});

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRol(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      if (
        textoVacio(nombre) ||
        textoVacio(aPaterno) ||
        textoVacio(aMaterno) ||
        textoVacio(fechaNac) ||
        textoVacio(telefono) ||
        textoVacio(curp) ||
        textoVacio(correo) ||
        textoVacio(usuario) ||
        textoVacio(contrasena) ||
        textoVacio(rol)
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

      if (curp.trim().length !== 18)
        throw new Error("Ingrese una CURP con un formato correcto.");

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo))
        throw new Error("Ingrese un correo electrónico válido.");

      // Password strength validation (example: at least 8 characters)
      if (contrasena.length < 8)
        throw new Error("La contraseña debe tener al menos 8 caracteres.");

      const dataDocente = {
        nombre: nombre.trim().toUpperCase(),
        aPaterno: aPaterno.trim().toUpperCase(),
        aMaterno: aMaterno.trim().toUpperCase(),
        telefono,
        fechaNac: fechaNac.trim(), // Usa la fecha formateada
        curp: curp.trim().toUpperCase(),
        correo,
        usuario,
        contrasena,
        rol,
      };

      setData(dataDocente);
      onConfirmarOpen();
    } catch (error: any) {
      console.error("Error al registrar el docente:", error);
      toast.error(error.message || "Error al registrar el docente");
    }
  };

  const {
    onOpen: onConfirmarOpen,
    isOpen: isConfirmarOpen,
    onOpenChange: onConfirmarOpenChange,
  } = useDisclosure();

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Registrar docente
            </ModalHeader>
            <ModalBody>
              <div>
                <h1 className="text-center font-bold mb-4">
                  Información del docente
                </h1>
                <div className="flex flex-row gap-3">
                  <Input
                    type="text"
                    name="nombre"
                    value={nombre}
                    label="Nombre"
                    labelPlacement="outside"
                    placeholder="Ej. Juan"
                    onValueChange={setNombre}
                  />
                  <Input
                    type="text"
                    name="aPaterno"
                    value={aPaterno}
                    label="Apellido Paterno"
                    labelPlacement="outside"
                    placeholder="Ej. Vazquez"
                    onValueChange={setAPaterno}
                  />
                  <Input
                    type="text"
                    name="aMaterno"
                    value={aMaterno}
                    label="Apellido Materno"
                    labelPlacement="outside"
                    placeholder="Ej. Mendez"
                    onValueChange={setAMaterno}
                  />
                </div>
                <div className="flex flex-row gap-2 pt-4">
                  <Input
                    type="text"
                    name="telefono"
                    value={telefono}
                    label="Teléfono"
                    labelPlacement="outside"
                    placeholder="Ej. 1123456789"
                    onValueChange={setTelefono}
                  />
                  <Input
                    type="date"
                    name="fechaNac"
                    value={fechaNac}
                    label="Fecha de Nacimiento"
                    labelPlacement="outside"
                    onValueChange={setFechaNac}
                  />
                </div>
                <div className="flex flex-row gap-3  pt-4">
                  <Input
                    type="text"
                    name="curp"
                    value={curp}
                    label="CURP"
                    labelPlacement="outside"
                    placeholder="Ej. PEGJ850315HJCRRN07"
                    onValueChange={setCurp}
                  />
                  <Input
                    type="email"
                    name="correo"
                    value={correo}
                    label="Correo"
                    labelPlacement="outside"
                    placeholder="Ej. ejemplo@gmail.com"
                    onValueChange={setCorreo}
                  />
                </div>
                <div className=" flex flex-row gap-2  pt-4">
                  <Input
                    type="text"
                    name="usuario"
                    value={usuario}
                    label="Usuario"
                    labelPlacement="outside"
                    placeholder="Ej. Usuario"
                    onValueChange={setUsuario}
                  />
                  <Input
                    type="password"
                    name="contrasena"
                    value={contrasena}
                    label="Contraseña"
                    labelPlacement="outside"
                    placeholder="Ej. Usuario1"
                    onValueChange={setContrasena}
                  />
                </div>
                <Select
                  label="Rol del docente"
                  placeholder="Seleccione el rol"
                  selectedKeys={[rol]}
                  onChange={handleSelectionChange}
                  labelPlacement="outside"
                  className=" pt-4"
                >
                  <SelectItem key={"doc"}>Docente</SelectItem>
                  <SelectItem key={"dir"}>Director</SelectItem>
                </Select>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button className="bg-verde" onPress={onClose}>
                Cerrar
              </Button>

              <Button
                className=" bg-verdeFuerte text-[#ffffff]"
                /*@ts-ignore*/
                onPress={handleSubmit}
              >
                Registrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
      <ConfirmarRegistro
        isOpen={isConfirmarOpen}
        onOpenChange={onConfirmarOpenChange}
        isOpenForm={isOpen}
        isOpenChangeForm={onOpenChange}
        data={data}
        setRefetch={setRefetch}
      />
    </Modal>
  );
}

export default RegistrarDocente;
