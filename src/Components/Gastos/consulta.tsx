import React, {useEffect, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import RegistrarAlumno from "@/Components/Alumnos/registrarAlumno";
import MainLayout from "@/Components/Layout/MainLayout";
import {Button, Spinner, useDisclosure} from "@nextui-org/react";
import ConsultaEspecificaAlumno from "@/Components/Alumnos/consultaEspecifica";
import ConfirmarEliminarAlumno from "@/Components/Alumnos/confirmarEliminarAlumno";
import ModificarAlumno from "@/Components/Alumnos/modificarAlumno";
import RegistrarGasto from "@/Components/Gastos/registrarGasto";

function ConsultaGastos() {
    const [gastos, setGastos] = useState([]);
    const [cargando, setCargando] = useState(true);

    //Variables para controlar el modal de registrar gasto
    const {
        onOpen: onRegistarOpen,
        isOpen: isRegistrarOpen,
        onOpenChange: onRegistarOpenChange,
    } = useDisclosure();

    useEffect(() => {
        fetchGastos();
    }, []);

    const fetchGastos = async () => {
        try {
            const response = await axios.get("/api/gastos");
            if (response.status >= 200 && response.status < 300) {
                setGastos(response.data);
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

    return (
        <MainLayout>
            <div>
                <h1>Gastos</h1>
                <Button onPress={onRegistarOpen}>Registrar Gastos</Button>
                <div>
                    {cargando ? (
                        <>
                            <Spinner size="lg" />
                        </>
                    ) : (
                        <div className="flex flex-col">
                            {gastos.map((g: any) => (
                                // eslint-disable-next-line react/jsx-key
                                <div className="flex flex-row gap-3">
                                    {g.concepto} {g.cantidad} {g.fecha} {" "}
                                    {/*<button*/}
                                    {/*    className="text-blue-800 underline"*/}
                                    {/*    onClick={() => handleVerDetalles(al)}*/}
                                    {/*>*/}
                                    {/*    Ver detalles*/}
                                    {/*</button>*/}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <RegistrarGasto
                    isOpen={isRegistrarOpen}
                    onOpenChange={onRegistarOpenChange}
                    fetchGastos={fetchGastos}
                />
            </div>
        </MainLayout>
    );
}

export default ConsultaGastos;