"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import MainLayout from "../Layout/MainLayout";
import { useDisclosure, Button, Input, Select } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import {
  fechaFutura,
  telefonoInvalido,
  textoVacio,
  tieneCaracteresEspeciales,
  tieneNumeros,
} from "@/utils/validaciones";
import ConsultaEspecificaAlumno from "../Alumnos/consultaEspecifica";
import ConsultaEspecifica from "./ConsultaEspecifica";

interface Docente {
  id?: number;
  nombre: string;
  aPaterno: string;
  aMaterno: string;
  telefono: string;
  fechaNac: string;
  curp: string;
  correo: string;
  usuario: string;
  contrasena: string;
  rol: string;
}

const ConsultaDocente = () => {
  const [docentes, setDocentes] = useState([]); // Aqui estan los docentes traidos con el fetch
  const [docente, setDocente] = useState<Docente>({
    nombre: "",
    aPaterno: "",
    aMaterno: "",
    telefono: "",
    fechaNac: "",
    curp: "",
    correo: "",
    usuario: "",
    contrasena: "",
    rol: "",
  }); //Estos son los campos que le debes mandar a la api
  const [enviado, setEnviado] = useState(false);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setDocente({ ...docente, [name]: value });
  };

  useEffect(() => {
    fetchDocentes();
  }, []);

  const fetchDocentes = async () => {
    try {
      const response = await axios.get("/api/docentes");
      if (response.status >= 200 && response.status < 300) {
        setDocentes(response.data);
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (
        e.response &&
        (e.response.status === 404 || e.response.status === 500)
      ) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setEnviado(true);

      if (
        textoVacio(docente.nombre) ||
        textoVacio(docente.aPaterno) ||
        textoVacio(docente.aMaterno) ||
        textoVacio(docente.fechaNac) ||
        textoVacio(docente.telefono) ||
        textoVacio(docente.curp) ||
        textoVacio(docente.correo) ||
        textoVacio(docente.usuario) ||
        textoVacio(docente.contrasena) ||
        textoVacio(docente.rol)
      ) {
        throw new Error("No deje campos vacíos.");
      }

      if (
        tieneNumeros(docente.nombre) ||
        tieneNumeros(docente.aPaterno) ||
        tieneNumeros(docente.aMaterno)
      )
        throw new Error("El nombre no puede contener números.");

      if (
        tieneCaracteresEspeciales(docente.nombre) ||
        tieneCaracteresEspeciales(docente.aPaterno) ||
        tieneCaracteresEspeciales(docente.aMaterno)
      ) {
        throw new Error("El nombre no puede tener caracteres especiales.");
      }

      if (fechaFutura(docente.fechaNac))
        throw new Error("No puede ingresar una fecha de nacimiento futura.");

      if (telefonoInvalido(docente.telefono))
        throw new Error("Ingrese un teléfono válido.");

      if (docente.curp.trim().length !== 18)
        throw new Error("Ingrese una CURP con un formato correcto.");

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(docente.correo))
        throw new Error("Ingrese un correo electrónico válido.");

      // Password strength validation (example: at least 8 characters)
      if (docente.contrasena.length < 8)
        throw new Error("La contraseña debe tener al menos 8 caracteres.");

      const formattedDate = new Date(docente.fechaNac)
        .toISOString()
        .split("T")[0];

      const response = await axios.post("/api/docentes", {
        ...docente,
        nombre: docente.nombre.trim().toUpperCase(),
        aPaterno: docente.aPaterno.trim().toUpperCase(),
        aMaterno: docente.aMaterno.trim().toUpperCase(),
        curp: docente.curp.trim().toUpperCase(),
        fechaNac: formattedDate, // Usa la fecha formateada
      });

      console.log("Docente registrado:", response.data);
      toast.success("Docente registrado con éxito");
      setEnviado(false);
      // Reset form or fetch updated list of docentes
      fetchDocentes();
    } catch (error: any) {
      console.error("Error al registrar el docente:", error);
      toast.error(error.message || "Error al registrar el docente");
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      const response = await axios.delete(`/api/docentes/${id}`);
      console.log("Docente eliminado:", response.data);
      toast.success("Docente eliminado con éxito");
      fetchDocentes();
    } catch (error) {
      console.error("Error al eliminar docente:", error);
      toast.error("Error al eliminar docente");
    }
  };

  const handleModificar = async () => {
    if (!docente.id) {
      toast.error("ID de docente no disponible");
      return;
    }

    try {
      const response = await axios.put(`/api/docentes/${docente.id}`, docente);
      console.log("Docente modificado:", response.data);
      toast.success("Docente modificado con éxito");
      onClose();
      fetchDocentes();
    } catch (error) {
      console.error("Error al modificar docente:", error);
      toast.error("Error al modificar docente");
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenDetalles,
    onOpen: onOpenDetalles,
    onOpenChange: onOpenChangeDetalles,
  } = useDisclosure();

  const handleDetalles = (docente: any) => {
    setDocenteSeleccionado(docente);
    onOpenDetalles();
  };

  return (
    <MainLayout>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            REGISTRO
            <label>
              Nombre:
              <Input
                type="text"
                name="nombre"
                value={docente.nombre}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Apellido Paterno:
              <Input
                type="text"
                name="aPaterno"
                value={docente.aPaterno}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Apellido Materno:
              <Input
                type="text"
                name="aMaterno"
                value={docente.aMaterno}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Teléfono:
              <Input
                type="text"
                name="telefono"
                value={docente.telefono}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Fecha de Nacimiento:
              <Input
                type="date"
                name="fechaNac"
                value={docente.fechaNac}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              CURP:
              <Input
                type="text"
                name="curp"
                value={docente.curp}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Correo:
              <Input
                type="email"
                name="correo"
                value={docente.correo}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Usuario:
              <Input
                type="text"
                name="usuario"
                value={docente.usuario}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Contraseña:
              <Input
                type="password"
                name="contrasena"
                value={docente.contrasena}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Rol:
              <Input
                type="text"
                name="rol"
                value={docente.rol}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <button type="submit">Guardar</button>
          </div>
        </form>
        <h2 className=" font-bold">Lista de Docentes</h2>
        <ul>
          {docentes.map((docente: any, index) => (
            <li key={index}>
              {docente.nombre}{" "}
              <Button
                onClick={() => handleEliminar(docente.id)}
                className=" bg-slate-500"
              >
                ELIMINAR
              </Button>
              <Button
                className="bg-blue-400"
                onPress={() => {
                  setDocente({ ...docente, id: docente.id });
                  onOpen();
                }}
              >
                Modificar
              </Button>
              <Button
                className="bg-blue-400"
                onPress={() => handleDetalles(docente)}
              >
                Detalles
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <div>
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label>
                        Nombre:
                        <Input
                          type="text"
                          name="nombre"
                          value={docente.nombre}
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Apellido Paterno:
                        <Input
                          type="text"
                          name="aPaterno"
                          value={docente.aPaterno}
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Apellido Materno:
                        <Input
                          type="text"
                          name="aMaterno"
                          value={docente.aMaterno}
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Teléfono:
                        <Input
                          type="text"
                          name="telefono"
                          value={docente.telefono}
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Fecha de Nacimiento:
                        <Input
                          type="date"
                          name="fechaNac"
                          value={docente.fechaNac}
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        CURP:
                        <Input
                          type="text"
                          name="curp"
                          value={docente.curp}
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Correo:
                        <Input
                          type="email"
                          name="correo"
                          value={docente.correo}
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Usuario:
                        <Input
                          type="text"
                          name="usuario"
                          value={docente.usuario}
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Contraseña:
                        <Input
                          type="password"
                          name="contrasena"
                          value={docente.contrasena}
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Rol:
                        <Input
                          type="text"
                          name="rol"
                          value={docente.rol}
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                  </form>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={handleModificar}>
                  Modificar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ConsultaEspecifica
        isOpen={isOpenDetalles}
        onOpen={onOpenDetalles}
        onOpenChange={onOpenChangeDetalles}
        docente={docenteSeleccionado}
      />
    </MainLayout>
  );
};

export default ConsultaDocente;
