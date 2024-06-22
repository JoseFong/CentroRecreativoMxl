import React, {useEffect, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {Button, Spinner, useDisclosure} from "@nextui-org/react";
import MainLayout from "@/Components/Layout/MainLayout";
import RegistrarGasto from "@/Components/Gastos/registrarGasto";
import ConsultaEspecificaGasto from "@/Components/Gastos/consultaEspecifica";

function ConsultaGastos() {
    const [gastos, setGastos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [gasto, setGasto] = useState(null);

    //Variables para controlar el modal de registrar gasto
    const {
        onOpen: onRegistarOpen,
        isOpen: isRegistrarOpen,
        onOpenChange: onRegistarOpenChange,
    } = useDisclosure();

    //Variables para controlar el modal de ver detalles
    const {
        onOpen: onVerDetallesOpen,
        isOpen: isVerDetallesOpen,
        onOpenChange: onVerDetallesOpenChange,
    } = useDisclosure();

    //Traer la informacion de todos los gastos
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

    //Funcion para ver los detalles de un gasto
    const handleVerDetalles = (gasto: any) => {
        setGasto(gasto);
        onVerDetallesOpen();
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
                                    <button
                                        className="text-blue-800 underline"
                                        onClick={() => handleVerDetalles(g)}
                                    >
                                        Ver detalles
                                    </button>
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
                <ConsultaEspecificaGasto
                    gasto={gasto}
                    isOpen={isVerDetallesOpen}
                    onOpenChange={onVerDetallesOpenChange}
                />
            </div>
        </MainLayout>
    );
}

export default ConsultaGastos;