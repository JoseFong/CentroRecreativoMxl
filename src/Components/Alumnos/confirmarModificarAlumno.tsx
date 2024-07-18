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

function ConfirmarModificarAlumno({
  isOpen,
  onOpenChangeModal,
  onOpenChange,
  data,
  nombres,
  fetchAlumnos,
  nombreGrupo,
}: {
  isOpen: any;
  onOpenChangeModal: any;
  onOpenChange: any;
  data: any;
  nombres: any;
  fetchAlumnos: () => void;
  nombreGrupo: any;
}) {
  return (
    <>
      {data && (
        <ModalConAl
          isOpen={isOpen}
          onOpenChangeModal={onOpenChangeModal}
          onOpenChange={onOpenChange}
          data={data}
          nombres={nombres}
          fetchAlumnos={fetchAlumnos}
          nombreGrupo={nombreGrupo}
        />
      )}
    </>
  );
}

function ModalConAl({
  isOpen,
  onOpenChangeModal,
  onOpenChange,
  data,
  nombres,
  fetchAlumnos,
  nombreGrupo,
}: {
  isOpen: any;
  onOpenChangeModal: any;
  onOpenChange: any;
  data: any;
  nombres: any;
  nombreGrupo: any;
  fetchAlumnos: () => void;
}) {
  const modificar = async (onClose2: any) => {
    try {
      const response = await axios.patch("/api/alumnos/" + data.id, data);
      if (response.status === 200) {
        toast.success("Se modificó la información del alumno.");
        fetchAlumnos();
        onClose2();
        onOpenChangeModal(false);
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (e.response) {
        if (e.response.status === 404 || e.response.status === 500) {
          toast.error(e.response.data.message);
        } else {
          toast.error(e.message);
        }
      } else {
        toast.error(e.message);
      }
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose2) => (
            <>
              <ModalHeader>
                ¿Seguro que quiere modificar la información del alumno?
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col">
                  <p>
                    <span className="font-bold">Nombre: </span>
                    {data.nombre} {data.aPaterno} {data.aMaterno}
                  </p>
                  <p>
                    <span className="font-bold">Género: </span>
                    {data.genero}
                  </p>
                  <p>
                    <span className="font-bold">Fecha de Nacimiento: </span>
                    {data.fechaNac}
                  </p>
                  <p>
                    <span className="font-bold">Telefono del Tutor: </span>
                    {data.telefono}
                  </p>
                  {data.telefonoAl.trim() !== "" && (
                    <>
                      <p>
                        <span className="font-bold">Teléfono del Alumno: </span>
                        {data.telefonoAl}
                      </p>
                    </>
                  )}
                  <p>
                    <span className="font-bold">Dirección: </span>
                    {data.direccion}
                  </p>
                  <p>
                    <span className="font-bold">CURP: </span>
                    {data.curp}
                  </p>
                  {data.grupoId !== "" && (
                    <p>
                      <span className="font-bold">Grupo: </span>
                      {nombreGrupo}
                    </p>
                  )}
                  <p className="mt-3">
                    <span className="font-bold">Neurodivergencia(s): </span>
                    {nombres}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row gap-2">
                  <Button onPress={onClose2} className="bg-verde">
                    Cancelar
                  </Button>
                  <Button
                    className="bg-verdeFuerte text-[#ffffff]"
                    onPress={() => modificar(onClose2)}
                  >
                    Aceptar
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

export default ConfirmarModificarAlumno;
