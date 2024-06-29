import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem
} from "@nextui-org/react";
import {useEffect, useState} from "react";
import ConfirmarModificarGrupo from "./confirmarModificarGupo";

function ModificarGrupo({
                            docentes,
                            isOpen,
                            onOpenChange,
                            selectedGrupo,
                            selectedDocente,
                            grupos,
                            fetchGrupos,
                            selectedAlumnos,
                            alumnos
                        }: {
    docentes: any,
    isOpen: any,
    onOpenChange: any,
    selectedGrupo: any,
    selectedDocente?: any,
    grupos: any[],
    alumnos: any,
    fetchGrupos?: () => any,
    selectedAlumnos?: any[]
}) {
    const [nombre, setNombre] = useState(selectedGrupo ? selectedGrupo.nombre : "");
    const [docenteId, setDocenteId] = useState(selectedGrupo ? selectedGrupo.docenteId : "");
    const [docentesDisponibles, setDocentesDisponibles] = useState([]);
    const [alumnosDisponibles, setAlumnosDisponibles] = useState([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Nuevo estado para el modal de confirmación
    const [data, setData] = useState(); // Nuevo estado para los datos de confirmación

    useEffect(() => {
        const docentesConGrupo = grupos.filter((g: any) => g.docenteId != null).map((g: any) => g.docenteId);
        const docentesSinGrupo = docentes.filter((d: any) => !docentesConGrupo.includes(d.id))
        docentesSinGrupo.push(selectedDocente); // Agrega el docente al listado de docentes disponibles
        setDocentesDisponibles(docentesSinGrupo);

        const alumnosConGrupo = alumnos.filter((a: any) => a.grupoId != null).map((a: any) => a.grupoId);
        const alumnosSinGrupo = alumnos.filter((a: any) => !alumnosConGrupo.includes(a.id));
        alumnosSinGrupo.push(selectedAlumnos); // Agrega los alumnos al listado de alumnos disponibles
        setAlumnosDisponibles(alumnosSinGrupo);
    }, [docentes, grupos, alumnos, docentesDisponibles, alumnosDisponibles])

    useEffect(() => {
        if (selectedGrupo) {
            setNombre(selectedGrupo.nombre ? selectedGrupo.nombre : "");
            setDocenteId(selectedGrupo.docenteId ? selectedGrupo.docenteId : "");
        }
    }, [selectedGrupo, onOpenChange]);

    const handleModificar = () => {
        if (selectedGrupo) {
            const dataTemp = {
                ...selectedGrupo,
                nombre: nombre.trim(),
                docenteId: docenteId ? parseInt(docenteId) : null
            };
            setData(dataTemp);
            setIsConfirmOpen(true); // Abre el modal de confirmación
        }
    };

    // @ts-ignore
    return (
        selectedGrupo &&
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>Modificar Grupo</ModalHeader>
                <ModalBody>
                    <Input
                        label="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <Select
                        label="Docente"
                        placeholder={selectedDocente.nombre}
                        value={docenteId || ""}
                        onChange={(e) => setDocenteId(e.target.value)}
                    >
                        {
                            docentesDisponibles ?
                                docentesDisponibles.map((docente : any) => (
                                    docente && <SelectItem key={docente.id} value={docente.id}>
                                        {docente.nombre}
                                    </SelectItem>))
                                : []
                        }
                    </Select>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={handleModificar}>
                        Modificar
                    </Button>
                    <Button onClick={() => onOpenChange()}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
            <ConfirmarModificarGrupo
                data={data}
                isOpen={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                fetchGrupos={fetchGrupos}
            />
        </Modal>
    )
}

export default ModificarGrupo;