import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function NeurodivergenciaDeAlumnos({ alumno }: { alumno: any }) {
  //Neurodivergencias del alumno
  const [nees, setNees] = useState([]);

  //Se ejecuta cuando se monta este componente, manda llamar la función
  useEffect(() => {
    fetchNeesDeAlumno();
  }, []);

  //Consigue las neurodivergencias de un alumno especificamente.
  const fetchNeesDeAlumno = async () => {
    try {
      const response = await axios.get("/api/nee/neesDeAlumno/" + alumno.id);
      if (response.status >= 200 && response.status < 300) {
        setNees(response.data);
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

  //Por cada neurodivergencia se ponen en un listado vertical
  return (
    <p className="flex flex-col">
      {nees.length > 0 ? (
        nees.map((n: any, index) => <p key={index}>{n.nombre}</p>)
      ) : (
        <p>No seleccionado</p>
      )}
    </p>
  );
}

export default NeurodivergenciaDeAlumnos;
