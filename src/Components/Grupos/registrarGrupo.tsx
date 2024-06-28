import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    useDisclosure
} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import toast from "react-hot-toast";
import ConfirmarRegistrarGrupo from "@/Components/Grupos/confrmarRegistrarGrupo";

function RegistrarGrupo({isOpen, onOpenChange, fetchGrupos, docentes, grupos}: {
    isOpen: boolean,
    onOpenChange: (value: boolean) => void,
    fetchGrupos: any,
    docentes: any,
    grupos: any
}) {
    const [nombre, setNombre] = useState("");
    const [docenteId, setDocenteId] = useState("");
    const [nombreDocente, setNombreDocente] = useState("");
    const [docentesSinGrupo, setDocentesSinGrupo] = useState([]);

    useEffect(() => {
        sinGrupo();
    }, [docentesSinGrupo]);

    const {
        onOpen: onConfirmarOpen,
        isOpen: isConfirmarOpen,
        onOpenChange: onConfirmarOpenChange,
    } = useDisclosure();

    const handleRegistrar = () => {
        if (nombre.trim() === "") {
            toast.error("No deje campos en blanco.");
            return;
        }

        if (docenteId === "") {
            setNombreDocente("Sin docente asignado");
            onConfirmarOpen();
            return;
        }

        setNombreDocente(docentes.find((d: any) => d.id === parseInt(docenteId)).nombre);
        onConfirmarOpen();
    };

    const reset = () => {
        setNombre("");
        setDocenteId("");
    };

    const sinGrupo = () => {
        const docentesConGrupo = grupos.filter((g: any) => g.docenteId != null).map((g: any) => g.docenteId);
        setDocentesSinGrupo(docentes.filter((d: any) => !docentesConGrupo.includes(d.id)));
    }

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader>Registrar Grupo</ModalHeader>
                    <ModalBody>
                        <Input
                            isRequired
                            type="text"
                            label="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                        <Select
                            label="Docente (Opcional)"
                            labelPlacement="outside"
                            placeholder="Docente"
                            value={docenteId || ""}
                            onChange={(e) => setDocenteId(e.target.value)}
                            className="mt-8"
                            isDisabled={docentesSinGrupo.length === 0}
                            defaultSelectedKeys={[parseInt(docenteId)]}
                        >
                            {docentesSinGrupo.map((docente: any) => (
                                <SelectItem key={docente.id} value={docente.id}>
                                    {docente.nombre}
                                </SelectItem>
                            ))}
                        </Select>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleRegistrar} color="success">
                            Registrar
                        </Button>
                        <Button onClick={() => onOpenChange(false)}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <ConfirmarRegistrarGrupo
                data={{nombre, docenteId: docenteId || ""}}
                isOpen={isConfirmarOpen}
                nombreDocente={nombreDocente}
                onOpenChange={onConfirmarOpenChange}
                fetchGrupos={fetchGrupos}
                reset={reset}
            />
        </>
    );
}

export default RegistrarGrupo;