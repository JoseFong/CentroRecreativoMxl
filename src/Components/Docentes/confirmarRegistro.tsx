import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function confirmarRegistro({
  isOpen,
  onOpenChange,
  data,
  isOpenForm,
  isOpenChangeForm,
  setRefetch,
}: any) {
  const [loading, setLoading] = useState(false);

  const handleAceptar = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/docentes", data);
      if (response.data.error) {
        // Si hay un error en la respuesta, lanzamos una excepción
        throw new Error(response.data.error);
      }
      toast.success(
        response.data.message || "Docente registrado exitosamente."
      );
      onOpenChange(false);
      isOpenChangeForm(false);
      setRefetch(true);
    } catch (e: any) {
      if (axios.isAxiosError(e)) {
        // Error de red o respuesta del servidor
        toast.error(e.response?.data?.message || e.message);
      } else {
        // Error lanzado manualmente (como duplicado de CURP o usuario)
        toast.error(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                ¿Seguró que quiere registrar al siguiente docente?
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col">
                  <p>
                    <span className="font-bold">Nombre: </span>
                    {data.nombre} {data.aPaterno} {data.aMaterno}
                  </p>
                  <p>
                    <span className="font-bold">Fecha de Nacimiento: </span>
                    {data.fechaNac}
                  </p>
                  <p>
                    <span className="font-bold">Telefono: </span>
                    {data.telefono}
                  </p>
                  <p>
                    <span className="font-bold">Correo: </span>
                    {data.correo}
                  </p>
                  <p>
                    <span className="font-bold">CURP: </span>
                    {data.curp}
                  </p>

                  <p>
                    <span className="font-bold">Usuario: </span>
                    {data.usuario}
                  </p>
                  <p>
                    <span className="font-bold">Contraseña: </span>
                    {data.contrasena}
                  </p>
                  <p>
                    <span className="font-bold">Rol: </span>
                    {data.rol === "doc" ? "Docente" : "Director"}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row gap-2">
                  <Button onPress={onClose} className=" bg-verde">
                    Cancelar
                  </Button>
                  <Button
                    className=" bg-verdeFuerte text-[#ffffff]"
                    onPress={() => handleAceptar()}
                    isDisabled={loading}
                  >
                    {loading ? "Registrando..." : "Aceptar"}
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default confirmarRegistro;
