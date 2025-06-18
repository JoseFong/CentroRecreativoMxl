import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function ConsultaSalidasGrupo({ grupoId }: { grupoId: number }) {
    const [salidas, setSalidas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchSalidas = async () => {
            setCargando(true);
            try {
                const response = await axios.get(`/api/salidas/porGrupo/${grupoId}`);
                setSalidas(response.data);
            } catch (error) {
                toast.error("Error al cargar las salidas");
            } finally {
                setCargando(false);
            }
        };

        fetchSalidas();
    }, [grupoId]);

    return (
        <>
        </>
    );
}

export default ConsultaSalidasGrupo;