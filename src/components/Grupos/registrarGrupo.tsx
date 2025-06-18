import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmarRegistrarGrupo from "@/components/Grupos/confrmarRegistrarGrupo";

function RegistrarGrupo({
  isOpen,
  onOpenChange,
  fetchGrupos,
  fetchAlumnos,
  docentes,
  grupos,
  alumnos,
  selectedAlumnos,
  selectedDocente,
}: {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  fetchGrupos: any;
  fetchAlumnos: any;
  docentes: any;
  grupos: any;
  alumnos: any;
  selectedAlumnos: any;
  selectedDocente: any;
}) {
  interface Alumno {
    id: number;
    nombre: string;
    aPaterno: string;
    aMaterno: string;
    grupoId?: number | null; // Puede ser null si no está asignado a un grupo
  }

  interface Docente {
    id: number;
    nombre: string;
  }

  interface Grupo {
    id: number;
    nombre: string;
    docenteId?: number | null; // Puede ser null si no tiene docente asignado
    alumnosIds: number[];
  }

  const [nombre, setNombre] = useState("");
  const [docenteId, setDocenteId] = useState("");
  const [nombreDocente, setNombreDocente] = useState("");
  const [docentesSinGrupo, setDocentesSinGrupo] = useState([]);
  const [alumnosDisponibles, setAlumnosDisponibles] = useState<Alumno[]>([]);
  const [selectedAlumnosIds, setSelectedAlumnosIds] = useState<number[]>([]);
  const [docentesDisponibles, setDocentesDisponibles] = useState<Docente[]>([]);

  const {
    onOpen: onConfirmarOpen,
    isOpen: isConfirmarOpen,
    onOpenChange: onConfirmarOpenChange,
  } = useDisclosure();

  useEffect(() => {
    const docentesConGrupo = grupos
      .filter((g: any) => g.docenteId !== null)
      .map((g: any) => g.docenteId!); // ! para asegurar que no es null
    const docentesDisponibles = docentes.filter(
      (d: any) =>
        !docentesConGrupo.includes(d.id) || d.id === selectedDocente?.id
    );
    const desasignarDocente = { id: -1, nombre: "Sin docente asignado" };
    setDocentesDisponibles([desasignarDocente, ...docentesDisponibles]);
    // Filtra a los alumnos que no tienen un grupoId o que están en el grupo seleccionado
    const alumnosSinGrupo = alumnos.filter(
      (a: any) =>
        !a.grupoId ||
        (selectedAlumnos && selectedAlumnos.some((sa: any) => sa.id === a.id))
    );
    setAlumnosDisponibles(alumnosSinGrupo);
  }, [docentes, grupos, alumnos, selectedAlumnos]);

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

    setNombreDocente(
      docentes.find((d: any) => d.id === parseInt(docenteId)).nombre
    );

    onConfirmarOpen();
  };

  const reset = () => {
    setNombre("");
    setDocenteId("");
    setSelectedAlumnosIds([]);
  };

  const handleSelectAlumno = (id: number) => {
    setSelectedAlumnosIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((alumnoId) => alumnoId !== id)
        : [...prevIds, id]
    );
  };

  const handleSelectAllAlumnos = () => {
    setSelectedAlumnosIds((prevIds) =>
      prevIds.length === alumnosDisponibles.length
        ? []
        : alumnosDisponibles
            .filter((alumno) => !alumno.grupoId)
            .map((alumno) => alumno.id)
    );
  };

  useEffect(() => {
    sinGrupo();
  }, [isOpen]);

  const sinGrupo = () => {
    const docentesConGrupo = grupos
      .filter((g: any) => g.docenteId != null)
      .map((g: any) => g.docenteId);
    setDocentesSinGrupo(
      docentes.filter((d: any) => !docentesConGrupo.includes(d.id))
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
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
            <div className="h-80 overflow-auto p-2">
              <Table aria-label="Lista de alumnos">
                <TableHeader>
                  <TableColumn className="bg-headerNav text-[#ffffff] ">
                    Alumno
                  </TableColumn>
                  <TableColumn className="bg-headerNav text-[#ffffff] ">
                    <Checkbox
                      color="warning"
                      isSelected={
                        alumnosDisponibles.length === selectedAlumnosIds.length
                      }
                      onChange={handleSelectAllAlumnos}
                    />
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {alumnosDisponibles
                    .filter((alumno) => !alumno.grupoId)
                    .map((alumno) => (
                      <TableRow key={alumno.id}>
                        <TableCell>
                          {alumno.nombre.toUpperCase()}{" "}
                          {alumno.aPaterno.toUpperCase()}{" "}
                          {alumno.aMaterno ? alumno.aMaterno.toUpperCase() : ""}
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            color="warning"
                            isSelected={selectedAlumnosIds.includes(alumno.id)}
                            onChange={() => handleSelectAlumno(alumno.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button className=" bg-verde " onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>

            <Button
              onClick={handleRegistrar}
              className=" bg-verdeFuerte text-[#ffffff]"
            >
              Registrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ConfirmarRegistrarGrupo
        data={{
          nombre,
          docenteId: docenteId || null, // Asegúrate de que sea null si no hay docente
          selectedAlumnosIds: selectedAlumnosIds,
        }}
        isOpen={isConfirmarOpen}
        nombreDocente={nombreDocente}
        onOpenChange={(isOpen: any) => {
          onConfirmarOpenChange();
          if (!isOpen) onOpenChange(false); // Cierra el modal de registro
        }}
        fetchGrupos={fetchGrupos}
        fetchAlumnos={async () => {
          await fetchAlumnos();
          const alumnosSinGrupo = alumnos.filter(
            (a: any) =>
              !a.grupoId ||
              (selectedAlumnos &&
                selectedAlumnos.some((sa: any) => sa.id === a.id))
          );
          setAlumnosDisponibles(alumnosSinGrupo);
        }}
        reset={reset}
      />
    </>
  );
}

export default RegistrarGrupo;
