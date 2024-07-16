import React, {useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {Button, Input, Modal, ModalBody, ModalFooter, ModalHeader} from "@nextui-org/react";

interface RegistroSalidasGrupoProps {
    grupoId: number,
    isOpen: boolean,
    onOpenChange: any
}

const RegistroSalidasGrupo: React.FC<RegistroSalidasGrupoProps> = ({
                                                                       grupoId,
                                                                       isOpen,
                                                                       onOpenChange
                                                                   }) => {
    const [fecha, setFecha] = useState("");
    const [descripcion, setDescripcion] = useState("");

    // Función para registrar la salida
    const registrarSalida = async () => {
        try {
            const response = await axios.post(`/api/salidas`, {
                fecha,
                descripcion,
            });
            if (response.status >= 200 && response.status < 300) {
                toast.success("Salida registrada con éxito");
                onOpenChange(false); // Cerrar el modal después de registrar

            } else {
                throw new Error("Error al registrar la salida");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Error desconocido al registrar la salida");
        }
    };

    return (
        <>

        </>
    );
};

export default RegistroSalidasGrupo;