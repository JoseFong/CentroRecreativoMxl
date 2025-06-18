import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";

function ConfirmarEliminarAlumno({
  isOpen,
  onOpenChange,
  alumno,
  fetchAlumnos,
}: {
  isOpen: any;
  onOpenChange: any;
  alumno: any;
  fetchAlumnos: () => void;
}) {
  //Función que elimina a un alumno, se ejecuta cuando se presiona eliminar
  const handleEliminar = async (onClose: any) => {
    try {
      const response = await axios.delete("/api/alumnos/" + alumno.id); //fetch con axios a api
      if (response.status >= 200 && response.status < 300) {
        //respuesta exitosa
        toast.success("Se eliminó el registro del alumno exitosamente");
        fetchAlumnos();
        onClose();
      } else {
        //respuesta no exitosa
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      //mensajes de error
      if (e.response.status === 404 || e.response.status === 500) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  };

  //Contenido, solo es un mensaje de confirmación
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                ¿Seguro que quiere eliminar el registro de {alumno.nombre}{" "}
                {alumno.aPaterno}?
              </ModalHeader>
              <ModalBody>
                <p className="text-red-600">Esta acción es permanente.</p>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row gap-1">
                  <Button onPress={onClose} className="bg-verde">Cancelar</Button>
                  <Button
                    className=" bg-verdeFuerte text-[#ffffff]"
                    onPress={() => handleEliminar(onClose)}
                  >
                    Eliminar
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

export default ConfirmarEliminarAlumno;
