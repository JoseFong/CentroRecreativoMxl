import axios from "axios";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import toast from "react-hot-toast";

interface Props {
    data: any;
    isOpen: any;
    eliminarOpenChange: any;
    onOpenChange: any;
    fetchGrupos: any;
    fetchAlumnos: any;
}

function ConfirmarEliminarGrupo({
                                    data,
                                    isOpen,
                                    eliminarOpenChange,
                                    onOpenChange,
                                    fetchGrupos,
                                    fetchAlumnos
                                }: Props) {

    const eliminarGrupo = async () => {
        console.log("Data object:", data); // Debugging line
        if (!data || !data.id) {
            toast.error("ID del grupo no encontrado.");
            return;
        }

        try {
            const response = await axios.delete(`/api/grupos/${data.id}`);
            if (response.status >= 200 && response.status < 300) {
                toast.success("Grupo eliminado exitosamente.");
                if (fetchGrupos && fetchAlumnos) {
                    fetchAlumnos();
                    fetchGrupos();
                }
                // Cierra el modal
                onOpenChange(false);
                eliminarOpenChange(false);
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
    }

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                ¿Seguro que quiere eliminar el grupo {data.nombre}?
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-red-600">Las salidas y actividades también se borraran permanentemente.</p>
                            </ModalBody>
                            <ModalFooter>
                                <div className="flex flex-row gap-1">
                                    <Button onPress={onClose} className="bg-verde">
                                        Cancelar
                                    </Button>
                                    <Button
                                        className=" bg-verdeFuerte text-[#ffffff]"
                                        onPress={eliminarGrupo}
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

export default ConfirmarEliminarGrupo;