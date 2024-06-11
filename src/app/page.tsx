"use client";
import {
  Button,
  Checkbox,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import axios from "axios";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  //useState para guardar la lista de docentes
  const [docentes, setDocentes] = useState([]);

  //useState para saber si esta cargando o no
  const [cargando, setCargando] = useState(true);

  //useStates para los atributos del docente a registrar
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

  //cuando se abre este componente se llama la función fetchDocentes
  useEffect(() => {
    fetchDocentes();
  }, []);

  //la función fetchDocentes hace fetch con axios para conseguir los docentes
  const fetchDocentes = async () => {
    try {
      const response = await axios.get("/api/docentes");
      if (response.status >= 200 && response.status < 300) {
        //esto es si la petición tiene respuesta exitosa
        setDocentes(response.data);
        setCargando(false);
        setNombre("");
        setAMaterno("");
        setAPaterno("");
        setFechaNac("");
        setTelefono("");
        setCurp("");
        setContrasena("");
        setCorreo("");
        setUsuario("");
        setRol("");
      } else {
        //y esto si no
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (e.response.status === 404 || e.response.status === 500) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
      setCargando(false);
    }
  };

  //se ejecuta cada que haces click a un checkbox de director o docente
  const handleCheckbox = (tipo: string) => {
    if (rol === tipo) {
      setRol("");
    } else {
      setRol(tipo);
    }
  };

  //Se ejecuta cuando presionas el boton de registrar
  const handleRegistrar = () => {
    //validación de campos vacios
    if (
      nombre === "" ||
      aPaterno === "" ||
      aMaterno === "" ||
      telefono === "" ||
      fechaNac === "" ||
      curp === "" ||
      correo === "" ||
      usuario === "" ||
      contrasena === "" ||
      rol === ""
    ) {
      toast.error("No deje campos vacíos.");
      return;
    } else {
      //si no hay campos vacios se registra
      registrar();
    }
  };

  //funcion de registrar
  const registrar = async () => {
    //se guarda la información en data
    const data = {
      nombre: nombre,
      aPaterno: aPaterno,
      aMaterno: aMaterno,
      telefono: telefono,
      fechaNac: fechaNac,
      curp: curp,
      correo: correo,
      usuario: usuario,
      contrasena: contrasena,
      rol: rol,
    };

    //se hace el fetch con axios enviando la data
    try {
      const response = await axios.post("/api/docentes", data);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Se registró el docente.");
        fetchDocentes();
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

  //mensaje que se muestra.
  const handleMensaje = () => {
    toast.success("Este es un mensaje de exito.");
  };

  return (
    <div className="min-w-screen min-h-screen bg-zinc-300 flex flex-col justify-center p-11 items-center gap-11">
      <Button
        color="success"
        onPress={handleMensaje}
        className="absolute top-5 left-5"
      >
        Mostrar mensaje de éxito.
      </Button>
      <div className="bg-white p-5 rounded-xl shadow-xl flex items-center justify-center flex-col gap-3">
        <h1 className="font-bold text-lg">Registar docente</h1>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <Input
              placeholder="Nombre(s)"
              label="Nombre(s)"
              labelPlacement="outside"
              value={nombre}
              onValueChange={setNombre}
            />
            <Input
              placeholder="Apellido paterno"
              label="Apellido paterno"
              labelPlacement="outside"
              value={aPaterno}
              onValueChange={setAPaterno}
            />
            <Input
              placeholder="Apellido materno"
              label="Apellido materno"
              labelPlacement="outside"
              value={aMaterno}
              onValueChange={setAMaterno}
            />
          </div>
          <div className="flex flex-row gap-2">
            <Input
              placeholder="Telefono"
              label="Telefono"
              labelPlacement="outside"
              value={telefono}
              onValueChange={setTelefono}
            />
            <Input
              placeholder="Correo"
              label="Correo"
              labelPlacement="outside"
              value={correo}
              onValueChange={setCorreo}
            />
          </div>

          <Input
            placeholder="Fecha de nacimiento"
            label="Fecha de nacimiento"
            labelPlacement="outside"
            value={fechaNac}
            onValueChange={setFechaNac}
          />
          <Input
            placeholder="CURP"
            label="CURP"
            labelPlacement="outside"
            value={curp}
            onValueChange={setCurp}
          />
          <div className="flex flex-row gap-2">
            <Input
              placeholder="Nombre de usuario"
              label="Nombre de usuario"
              labelPlacement="outside"
              value={usuario}
              onValueChange={setUsuario}
            />
            <Input
              type="password"
              placeholder="Contraseña"
              label="Contraseña"
              labelPlacement="outside"
              value={contrasena}
              onValueChange={setContrasena}
            />
          </div>
          <div className="flex flex-row gap-5 justify-center items-center">
            <div className="flex flex-row gap-1 justify-center items-center">
              <Checkbox
                isSelected={rol === "dir"}
                onChange={() => handleCheckbox("dir")}
              />
              <label>Administrador</label>
            </div>
            <div className="flex flex-row gap-1 justify-center items-center">
              <Checkbox
                isSelected={rol === "doc"}
                onChange={() => handleCheckbox("doc")}
              />
              <label>Docente</label>
            </div>
          </div>
        </div>
        <Button color="primary" onPress={handleRegistrar}>
          Registrar
        </Button>
      </div>
      <div className="bg-white p-5 shadow-xl rounded-xl flex flex-col justify-center items-center">
        <h1 className="font-bold text-lg">Lista de docentes</h1>
        {cargando ? (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <div>
            {docentes.length === 0 ? (
              <div>No hay docentes</div>
            ) : (
              <>
                {docentes.map((docente: any) => (
                  <div>
                    {docente.nombre} {docente.aPaterno} {docente.aMaterno}{" "}
                    {docente.usuario} {docente.correo}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
