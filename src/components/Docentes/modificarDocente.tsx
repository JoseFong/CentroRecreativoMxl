import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import ConfirmarModificar from "./confirmarModificar";
import {
  fechaFutura,
  telefonoInvalido,
  textoVacio,
  tieneCaracteresEspeciales,
  tieneNumeros,
  validarCURP,
} from "@/utils/validaciones";
import toast from "react-hot-toast";

function modificarDocente({ isOpen, onOpenChange, docente, setRefetch }: any) {
  const [nombre, setNombre] = useState("");
  const [aPaterno, setAPaterno] = useState("");
  const [aMaterno, setAMaterno] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNac, setFechaNac] = useState("");
  const [curp, setCurp] = useState("");
  const [correo, setCorreo] = useState("");
  const [data, setData] = useState({});

  useEffect(() => {
    if (docente) {
      setNombre(docente.nombre || "");
      setAPaterno(docente.aPaterno || "");
      setAMaterno(docente.aMaterno || "");
      setTelefono(docente.telefono || "");
      setCurp(docente.curp || "");
      setCorreo(docente.correo || "");

      const partes = docente.fechaNac.split("/");
      const fecha = partes[2] + "-" + partes[1] + "-" + partes[0];
      setFechaNac(fecha);
    }
  }, [docente]);

  const {
    onOpen: onConfirmarOpen,
    isOpen: isConfirmarOpen,
    onOpenChange: onConfirmarOpenChange,
  } = useDisclosure();

  const handleModificar = () => {
    console.log(docente.id);
    try {
      if (
        textoVacio(nombre) ||
        textoVacio(aPaterno) ||
        textoVacio(aMaterno) ||
        textoVacio(fechaNac) ||
        textoVacio(telefono) ||
        textoVacio(curp) ||
        textoVacio(correo)
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

      if (!validarCURP(curp.trim()))
        throw new Error("Ingrese una CURP con un formato válido.");

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo))
        throw new Error("Ingrese un correo electrónico válido.");

      const partes = fechaNac.split("-");
      const fechaForm = partes[2] + "/" + partes[1] + "/" + partes[0];

      const dataDocente = {
        nombre: nombre.trim().toUpperCase(),
        aPaterno: aPaterno.trim().toUpperCase(),
        aMaterno: aMaterno.trim().toUpperCase(),
        telefono,
        fechaNac: fechaForm, // Usa la fecha formateada
        curp: curp.trim().toUpperCase(),
        correo,
      };

      setData(dataDocente);
      onConfirmarOpen();
    } catch (error: any) {
      console.error("Error al modificar el docente:", error);
      toast.error(error.message || "Error al modificar el docente");
    }
  };

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
              Modificar docente
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
              </div>
            </ModalBody>
            <ModalFooter>
              <Button className="bg-verde" onPress={onClose}>
                Cerrar
              </Button>
              <Button
                className=" bg-verdeFuerte text-[#ffffff]"
                onPress={() => handleModificar()}
              >
                Modificar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
      <ConfirmarModificar
        isOpen={isConfirmarOpen}
        onOpenChange={onConfirmarOpenChange}
        data={data}
        docente={docente}
        setRefetch={setRefetch}
        onOpenChangeForm={onOpenChange}
      />
    </Modal>
  );
}

export default modificarDocente;
