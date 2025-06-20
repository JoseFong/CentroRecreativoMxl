import React, {useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {Button, Input, Select, SelectItem} from "@nextui-org/react";

const RegistroSalidasGrupo = ({esRegistro, docentes, grupos, refetch}: any) => {
    const [fecha, setFecha] = useState("");
    const [nombre, setNombre] = useState("");
    const [hora, setHora] = useState("");
    const [docenteId, setDocenteId] = React.useState<string>("");
    const [grupoId, setGrupoId] = React.useState<string>("");
    const [enviando, setEnviando] = useState(false);

    // Función para registrar la salida
    const registrarSalida = async () => {
        setEnviando(true);
        if (!fecha || !nombre || !hora || !docenteId || !grupoId) {
            toast.error("No deje espacios vacios");
        }
        try {
            const response = await axios.post(`/api/salidas`, {
                fecha,
                nombre,
                hora,
                docenteId,
                grupoId,
            });
            if (response.status >= 200 && response.status < 300) {
                toast.success("Salida registrada con éxito");
                setFecha("");
                setNombre("");
                setHora("");
                setDocenteId("");
                setGrupoId("");
                refetch();
            } else {
                throw new Error("Error al registrar la salida");
            }
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Error desconocido al registrar la salida"
            );
        } finally {
            setEnviando(false);
        }
    };

    const handleSelectionGrupo = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGrupoId(e.target.value);
    };

    const handleSelectionDocente = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDocenteId(e.target.value);
    };
    return (
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
                    onChange={handleSelectionDocente}
                    selectedKeys={[docenteId]}
                    className="pb-2"
                    size="sm"
                >
                    {// @ts-ignore
                        docentes.map((docente) => (
                            //@ts-ignore
                            <SelectItem key={docente.id} value={docente.nombre}>
                                {docente.nombre}
                            </SelectItem>
                        ))}
                </Select>
                <Select
                    label="Grupo asignado"
                    isRequired
                    selectedKeys={[grupoId]}
                    onChange={handleSelectionGrupo}
                    size="sm"
                >
                    {//@ts-ignore
                        grupos.map((grupo) => (
                            //@ts-ignore
                            <SelectItem key={grupo.id} value={grupo.nombre}>
                                {grupo.nombre}
                            </SelectItem>
                        ))}
                </Select>
            </div>
            <div className={`${esRegistro ? "none" : "hidden"}`}>
                <Button
                    className="bg-verdeFuerte text-[#ffffff] w-full mt-2"
                    onPress={() => registrarSalida()}
                    isDisabled={
                        enviando || !nombre || !hora || !docenteId || !grupoId || !fecha
                    }
                >
                    <p>Registrar</p>
                </Button>
            </div>
        </div>
    );
};

export default RegistroSalidasGrupo;
