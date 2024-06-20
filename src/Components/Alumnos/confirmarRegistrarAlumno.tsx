import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function ConfirmarRegistrarAlumno({
  isOpen,
  onOpenChange,
  data,
  nees,
  nee,
  fecha,
  fetchAlumnos,
  reset,
  fetchNees,
}: {
  onOpen: any;
  isOpen: any;
  onOpenChange: any;
  data: any;
  nees: any;
  nee: any;
  fecha: any;
  fetchAlumnos: () => void;
  reset: () => void;
  fetchNees: () => void;
}) {
  //Variables para formatear las neurodivergencias en forma de texto en vez de solo mostrar sus ids
  let neeDisplay: string = "";
  let nombres: string[] = [];
  const [nombresDeNEEs, setNombresDeNEEs] = useState("");

  //Variables para formatear la fecha en el formato deseado dd/mm/aaaa
  let fechaDisplay: string = "";
  const [fechaFormato, setFechaFormato] = useState("");

  //Esto se ejecuta cuando recién se carga el componente
  useEffect(() => {
    //Se reinician los nombres y el display de la fecha
    nombres = [];
    neeDisplay = "";

    //Si existe la fecha se formatea al formato dd/mm/aaaa
    if (fecha.length > 0) {
      const partes = fecha.split("-");
      fechaDisplay = partes[2] + "/" + partes[1] + "/" + partes[0];
      setFechaFormato(fechaDisplay);
    }

    //Si existen neurodivergencias, se formatean
    if (nee.length > 0) {
      const partes = nee.split(","); //Se dividen por comas
      partes.map((parte: string) => {
        //Por cada parte se obtiene de las neurodivergencias existentes su nombre
        const nee = nees.find((n: any) => n.id === parseInt(parte.trim()));
        nombres.push(nee.nombre); //Se agrega el nombre al arreglo de nombres
      });

      //Despues, usando el arreglo de nombres se itera y se agregan a un string separandolas por comas y un espacio.
      for (let i = 0; i < nombres.length; i++) {
        neeDisplay = neeDisplay + nombres[i];
        if (i !== nombres.length - 1) {
          neeDisplay = neeDisplay + ", ";
        }
      }

      //Se declara el display de las neurodivergencias como el string que modificamos anteriormente.
      setNombresDeNEEs(neeDisplay);
    }
  }, [fecha, nee]);

  //Función para aceptar, esto registra al alumno con la información que se ingresó
  const handleAceptar = async (onClose2: any) => {
    try {
      const response = await axios.post("/api/alumnos", data);
      if (response.status === 200) {
        toast.success("Alumno registrado exitosamente.");
        fetchAlumnos(); //Vuelve a conseguir los alumnos de la bd, para actualizar la tabla principal de alumnos
        reset(); //Vacía el formulario de registro de alumnos
        onClose2(); //Cierra este modal
        fetchNees(); //Vuelve a conseguir las neurodivergencias en caso de que se hayan modificado por alguna razón
      }
    } catch (e: any) {
      if (e.response.status === 500 || e.response.status === 404) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  };

  //Contenido de la página, es solo un mensaje de confirmación mostrando la información a registrar del alumno.
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose2) => (
            <>
              <ModalHeader>
                ¿Seguro que quiere registrar el siguiente alumno?
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col">
                  <p>
                    <span className="font-bold">Nombre: </span>
                    {data.nombre} {data.aPaterno} {data.aMaterno}
                  </p>
                  <p>
                    <span className="font-bold">Género: </span>
                    {data.genero}
                  </p>
                  <p>
                    <span className="font-bold">Fecha de Nacimiento: </span>
                    {fechaFormato}
                  </p>
                  <p>
                    <span className="font-bold">Telefono del Tutor: </span>
                    {data.telefono}
                  </p>
                  {data.telefonoAl.trim() !== "" && (
                    <>
                      <p>
                        <span className="font-bold">Nombre: </span>
                        {data.telefonoAl}
                      </p>
                    </>
                  )}
                  <p>
                    <span className="font-bold">Dirección: </span>
                    {data.direccion}
                  </p>
                  <p>
                    <span className="font-bold">CURP: </span>
                    {data.curp}
                  </p>
                  <p>
                    <span className="font-bold">Neurodivergencia(s): </span>
                    {nombresDeNEEs}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row gap-2">
                  <Button
                    color="success"
                    onPress={() => handleAceptar(onClose2)}
                  >
                    Aceptar
                  </Button>
                  <Button onPress={onClose2}>Cancelar</Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ConfirmarRegistrarAlumno;
