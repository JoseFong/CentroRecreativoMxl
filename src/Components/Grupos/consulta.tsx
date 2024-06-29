import axios from "axios";
import toast from "react-hot-toast";
import {Button, Spinner, useDisclosure} from "@nextui-org/react";
import MainLayout from "@/Components/Layout/MainLayout";
import {SetStateAction, useEffect, useState} from "react";
import RegistrarGrupo from "@/Components/Grupos/registrarGrupo";
import ConsultaEspecificaGrupo from "@/Components/Grupos/consultaEspecifica";

function ConsultaGrupos() {
    const [grupos, setGrupos] = useState([]);
    const [alumnos, setAlumnos] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [selectedGrupo, setSelectedGrupo] = useState(null);
    const [selectedDocente, setSelectedDocente] = useState(null);
    const [selectedAlumnos, setSelectedAlumnos] = useState([]);

    //Variables para manejar el modal de registro de grupo
    const {
        onOpen: onRegistarOpen,
        isOpen: isRegistrarOpen,
        onOpenChange: onRegistarOpenChange,
    } = useDisclosure();

    // Estado para manejar el grupo seleccionado
    const {
        onOpen: onConsultaEspecificaOpen,
        isOpen: isConsultaEspecificaOpen,
        onOpenChange: onConsultaEspecificaOpenChange,
    } = useDisclosure();

    // Función para manejar el click en un grupo
    const handleGrupoClick = (grupo: React.SetStateAction<null>, docente: any, alumnos: SetStateAction<never[]>) => {
        setSelectedGrupo(grupo);
        setSelectedDocente(docente);
        setSelectedAlumnos(alumnos);
        onConsultaEspecificaOpen();
    }

    //Traer la informacion de todos los grupos
    useEffect(() => {
        fetchGrupos();
        fetchDocentes();
        fetchAlumnos();
    }, []);

    // Función para obtener los grupos desde la API
    const fetchGrupos = async () => {
        try {
            const response = await axios.get("/api/grupos");
            if (response.status >= 200 && response.status < 300) {
                setGrupos(response.data);
                setCargando(false);
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

    // Función para obtener los docentes desde la API
    const fetchDocentes = async () => {
        try {
            const response = await axios.get("/api/docentes");
            if (response.status >= 200 && response.status < 300) {
                setDocentes(response.data);
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

    // Función para obtener los alumnos desde la API
    const fetchAlumnos = async () => {
        try {
            const response = await axios.get("/api/alumnos");
            if (response.status >= 200 && response.status < 300) {
                setAlumnos(response.data);
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

    // Función para obtener los docentes por grupo
    const docentesPorGrupo = (grupoId: number) => {
        const grupo: any = grupos.find((g: any) => g.id === grupoId);
        if (grupo) {
            return docentes.find((d: any) => d.id === grupo.docenteId);
        }
        return null;
    }

    // Función para obtener los alumnos por grupo
    const alumnosPorGrupo = (grupoId: number) => {
        return alumnos.filter((a: any) => a.grupoId === grupoId);
    }

    return (
        <MainLayout>
            <div>
                <h1>Grupos</h1>
                <Button color="success" onClick={onRegistarOpen}>
                    Registrar Grupo
                </Button>
                <div>
                    {cargando ? (
                        <>
                            <Spinner size="lg"/>
                        </>
                    ) : (
                        <div className="flex flex-col">
                            {grupos.map((g: any) => {
                                const docente = docentesPorGrupo(g.id);
                                const alumnos = alumnosPorGrupo(g.id);
                                return (
                                    <div className="flex flex-row gap-3" key={g.id}>
                                        {g.nombre}
                                        <p>
                                            { // @ts-ignore
                                                docente ? docente.nombre : "Sin docente asignado"
                                            }
                                        </p>
                                        {alumnos.map((alumno: any) => (
                                            <p key={alumno.id}>
                                                {alumno.nombre} {alumno.aPaterno} {alumno.aMaterno}
                                            </p>
                                        ))}
                                        <Button color="primary" onClick={() => handleGrupoClick(g, docente, alumnos)}>
                                            Detalles
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                <RegistrarGrupo
                    isOpen={isRegistrarOpen}
                    onOpenChange={onRegistarOpenChange}
                    fetchGrupos={fetchGrupos}
                    docentes={docentes} grupos={grupos}/>
                <ConsultaEspecificaGrupo
                    isOpen={isConsultaEspecificaOpen}
                    onOpenChange={onConsultaEspecificaOpenChange}
                    grupo={selectedGrupo} docente={selectedDocente} alumnos={selectedAlumnos}/>
            </div>
        </MainLayout>
    );
}

export default ConsultaGrupos;