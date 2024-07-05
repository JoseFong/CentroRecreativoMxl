import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";

function ConfirmarModificarGrupo({
  data,
  isOpen,
  onOpenChange,
  fetchGrupos,
  modificarOpenChange,
  fetchAlumnos,
}: {
  data: any;
  isOpen: any;
  onOpenChange: any;
  fetchGrupos?: () => any;
  modificarOpenChange: any;
  fetchAlumnos?: (() => Promise<void>) | undefined;
}) {
  const handleConfirm = async () => {
    try {
      data.cantidad = parseFloat(data.cantidad);
      const response = await axios.patch("/api/grupos/" + data.id, data);
      if (response.status === 200) {
        toast.success("Grupo modificado exitosamente.");
        if (fetchGrupos && fetchAlumnos) {
          fetchAlumnos();
          fetchGrupos();
        }
        // Cierra el modal
        onOpenChange(false);
        modificarOpenChange(false);
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

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Confirmar Modificación</ModalHeader>
        <ModalBody>
          ¿Estás seguro de que quieres modificar el grupo{" "}
          {data ? data.nombre : ""}?
        </ModalBody>
        <ModalFooter>
          <Button className=" bg-verde " onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className=" bg-verdeFuerte text-[#ffffff]"
            onClick={handleConfirm}
          >
            Confirmar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ConfirmarModificarGrupo;
