import React, { useEffect, useState } from "react";
import { Actividad, Grupo, Docente } from "@prisma/client";
import toast from "react-hot-toast";
import axios from "axios";
import { Spinner } from "@nextui-org/react";

interface ActInfo {
  actividad: Actividad;
  grupo: Grupo;
  docente: Docente;
}

function ConsultaActividades() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [registros, setRegistros] = useState<ActInfo[]>([]);

  useEffect(() => {
    fetchActividades();
    fetchDocentes();
    fetchGrupos();
  }, []);

  useEffect(() => {
    if (actividades && grupos && docentes) {
      let rs: ActInfo[] = [];
      actividades.map((act: Actividad) => {
        const g: Grupo = grupos.find((gr: Grupo) => gr.id === act.grupoId);
        const docenteId = g?.docenteId;
        const d: Docente = docentes.find(
          (doc: Docente) => doc.id === docenteId
        );
        const r: ActInfo = { actividad: act, docente: d, grupo: g };
        rs.push(r);
      });
      setRegistros(rs);
      setCargando(false);
    }
  }, [actividades, grupos, docentes]);

  const fetchActividades = async () => {
    try {
      const response = await axios.get("/api/actividades");
      if (response.status >= 200 && response.status < 300) {
        setActividades(response.data);
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (e.response) {
        const s = e.response.status;
        if (s === 404 || s === 400 || s === 500) {
          toast.error(e.response.data.message);
        } else {
          toast.error(e.message);
        }
      } else {
        toast.error(e.message);
      }
    }
  };

  const fetchDocentes = async () => {
    try {
      const response = await axios.get("/api/docentes");
      if (response.status >= 200 && response.status < 300) {
        setDocentes(response.data);
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (e.response) {
        const s = e.response.status;
        if (s === 404 || s === 400 || s === 500) {
          toast.error(e.response.data.message);
        } else {
          toast.error(e.message);
        }
      } else {
        toast.error(e.message);
      }
    }
  };

  const fetchGrupos = async () => {
    try {
      const response = await axios.get("/api/grupos");
      if (response.status >= 200 && response.status < 300) {
        setGrupos(response.data);
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (e.response) {
        const s = e.response.status;
        if (s === 404 || s === 400 || s === 500) {
          toast.error(e.response.data.message);
        } else {
          toast.error(e.message);
        }
      } else {
        toast.error(e.message);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <p>Actividades</p>
      {cargando ? (
        <Spinner size="lg" />
      ) : (
        <div className="flex flex-col">
          {registros.map((reg: ActInfo) => (
            <div className="flex flex-row">
              {" "}
              <p>
                {reg?.actividad?.nombre} {reg?.actividad?.horario}{" "}
                {reg?.grupo?.nombre} {reg?.docente?.nombre}{" "}
                {reg?.docente?.aPaterno}
              </p>
              <button className="underline text-blue-700">Eliminar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ConsultaActividades;
