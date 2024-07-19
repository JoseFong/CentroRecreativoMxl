import React, { useState } from "react";
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
} from "@nextui-org/react";
import toast from "react-hot-toast";
import axios from "axios";

function EditarSalida({
  isOpen,
  onOpenChange,
  salida,
  refetch,
  grupos,
  docentes,
}: any) {
  const [fecha, setFecha] = useState(salida.fecha);
  const [nombre, setNombre] = useState(salida.nombre);
  const [hora, setHora] = useState(salida.horaDeSalida);
  const [docenteId, setDocenteId] = React.useState<string>(salida.docenteId);
  const [grupoId, setGrupoId] = React.useState<string>(salida.grupoId);
  const [enviando, setEnviando] = useState(false);

  const handleSelectionGrupo = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGrupoId(e.target.value);
  };

  const handleSelectionDocente = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocenteId(e.target.value);
  };

  const handleModificar = async () => {
    setEnviando(true);
    if (!fecha || !nombre || !hora || !docenteId || !grupoId) {
      toast.error("No deje espacios vacios");
    }
    try {
      const response = await axios.patch(`/api/salidas/${salida.id}`, {
        fecha,
        nombre,
        hora,
        docenteId,
        grupoId,
      });
      if (response.status >= 200 && response.status < 300) {
        toast.success("Salida modificada con éxito");
        refetch();
        onOpenChange();
      } else {
        throw new Error("Error al modificar la salida");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error desconocido al modificar la salida"
      );
    } finally {
      setEnviando(false);
    }
  };

  const docenteAsignado = docentes.find(
    (docente: { id: string }) => docente.id === docenteId
  );
  const grupoAsignado = grupos.find(
    (grupo: { id: string }) => grupo.id === grupoId
  );

  return (
    <div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modificar salida
              </ModalHeader>
              <ModalBody>
                <div className="m-1">
                  <Input
                    label="Nombre de la salida"
                    placeholder="Ejm. Starbucks"
                    isRequired
                    value={nombre}
                    onValueChange={setNombre}
                    size="sm"
                  ></Input>
                  <div className="flex flex-row py-2">
                    <Input
                      type="date"
                      label="Fecha de la salida"
                      isRequired
                      value={fecha}
                      onValueChange={setFecha}
                      className="pr-2"
                      size="sm"
                    ></Input>
                    <Input
                      type="time"
                      label="Hora de salida"
                      isRequired
                      value={hora}
                      onValueChange={setHora}
                      size="sm"
                    ></Input>
                  </div>
                  <div>
                    <Select
                      label="Docente asignado"
                      isRequired
                      placeholder={
                        docenteAsignado
                          ? docenteAsignado.nombre
                          : "Selecciona un docente"
                      }
                      onChange={handleSelectionDocente}
                      selectedKeys={[docenteId]}
                      className="pb-2"
                      size="sm"
                    >
                      {
                        // @ts-ignore
                        docentes.map((docente) => (
                          //@ts-ignore
                          <SelectItem key={docente.id} value={docente.nombre}>
                            {docente.nombre}
                          </SelectItem>
                        ))
                      }
                    </Select>
                    <Select
                      label="Grupo asignado"
                      isRequired
                      placeholder={
                        grupoAsignado
                          ? grupoAsignado.nombre
                          : "Selecciona un grupo"
                      }
                      selectedKeys={[grupoId]}
                      onChange={handleSelectionGrupo}
                      size="sm"
                    >
                      {
                        //@ts-ignore
                        grupos.map((grupo) => (
                          //@ts-ignore
                          <SelectItem key={grupo.id} value={grupo.nombre}>
                            {grupo.nombre}
                          </SelectItem>
                        ))
                      }
                    </Select>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button className="bg-verde" onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  className="bg-verdeFuerte text-[#ffffff]"
                  onPress={() => handleModificar()}
                  isDisabled={
                    enviando ||
                    !nombre ||
                    !hora ||
                    !docenteId ||
                    !grupoId ||
                    !fecha
                  }
                >
                  <p>Modificar</p>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default EditarSalida;
