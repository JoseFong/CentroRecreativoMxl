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
  Tooltip,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import ConfirmarModificarGrupo from "./confirmarModificarGupo";
import toast from "react-hot-toast";

interface Docente {
  id: number;
  nombre: string;
}

interface Alumno {
  id: number;
  nombre: string;
  aPaterno: string;
  aMaterno: string;
  grupoId?: number | null; // Puede ser null si no está asignado a un grupo
}

interface Grupo {
  id: number;
  nombre: string;
  docenteId?: number | null; // Puede ser null si no tiene docente asignado
  alumnosIds: number[];
}

interface Props {
  salidasGrupo: any;
  docentes: Docente[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGrupo: Grupo | null;
  selectedDocente?: Docente | null;
  grupos: Grupo[];
  alumnos: Alumno[];
  fetchGrupos: () => void;
  selectedAlumnos?: Alumno[];
  fetchAlumnos?: () => Promise<void>;
}

function ModificarGrupo({
  salidasGrupo,
  docentes,
  isOpen,
  onOpenChange,
  selectedGrupo,
  selectedDocente,
  grupos,
  alumnos,
  fetchGrupos,
  selectedAlumnos,
  fetchAlumnos,
}: Props) {
  const [nombre, setNombre] = useState(selectedGrupo?.nombre || "");
  const [docenteId, setDocenteId] = useState<number | null>(
    selectedGrupo?.docenteId || null
  );
  const [docentesDisponibles, setDocentesDisponibles] = useState<Docente[]>([]);
  const [alumnosDisponibles, setAlumnosDisponibles] = useState<Alumno[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [data, setData] = useState<Grupo | null>(null);
  const [selectedAlumnosIds, setSelectedAlumnosIds] = useState<number[]>([]);

  useEffect(() => {
    const docentesConGrupo = grupos
      .filter((g) => g.docenteId !== null)
      .map((g) => g.docenteId!); // ! para asegurar que no es null
    const docentesDisponibles = docentes.filter(
      (d) => !docentesConGrupo.includes(d.id) || d.id === selectedDocente?.id
    );
    const desasignarDocente = { id: -1, nombre: "Sin docente asignado" };
    setDocentesDisponibles([desasignarDocente, ...docentesDisponibles]);

    // Filtra a los alumnos que no tienen un grupoId o que están en el grupo seleccionado
    const alumnosSinGrupo = alumnos.filter(
      (a) =>
        !a.grupoId ||
        (selectedAlumnos && selectedAlumnos.some((sa) => sa.id === a.id))
    );
    setAlumnosDisponibles(alumnosSinGrupo);
  }, [docentes, grupos, alumnos, selectedDocente, selectedAlumnos]);

  useEffect(() => {
    if (selectedGrupo) {
      setNombre(selectedGrupo.nombre);
      setDocenteId(selectedGrupo.docenteId || null);
      setSelectedAlumnosIds(
        selectedAlumnos ? selectedAlumnos.map((a) => a.id) : []
      );
    }
  }, [selectedGrupo]);

  const handleModificar = () => {
    if (nombre.trim() === "") {
      toast.error("No deje el nombre vacio");
      return;
    }

    if (selectedGrupo) {
      setData({
        ...selectedGrupo,
        nombre: nombre.trim().toUpperCase(),
        docenteId: docenteId,
        alumnosIds: selectedAlumnosIds,
      });
      setIsConfirmOpen(true);
    }
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
        : alumnosDisponibles.map((alumno) => alumno.id)
    );
  };

  return (
    selectedGrupo && (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          <ModalHeader>Modificar Grupo</ModalHeader>
          <ModalBody>
            <div className="flex flex-row ">
              <Input
                className="pr-3"
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <Select
                label="Docente"
                placeholder={
                  selectedDocente
                    ? selectedDocente.nombre
                    : "Selecciona un docente"
                }
                value={docenteId || ""}
                onChange={(e) =>
                  setDocenteId(e.target.value ? parseInt(e.target.value) : null)
                }
              >
                {docentesDisponibles
                  ? docentesDisponibles.map(
                      (docente: any) =>
                        docente && (
                          <SelectItem key={docente.id} value={docente.id}>
                            {docente.nombre}
                          </SelectItem>
                        )
                    )
                  : []}
              </Select>
            </div>

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
                  {alumnosDisponibles.map((alumno) => (
                    <TableRow key={alumno.id}>
                      <TableCell>
                        {alumno.nombre} {alumno.aPaterno}{" "}
                        {alumno.aMaterno ? alumno.aMaterno : ""}
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
              className=" bg-verdeFuerte text-[#ffffff]"
              onClick={handleModificar}
            >
              Modificar
            </Button>
          </ModalFooter>
        </ModalContent>
        <ConfirmarModificarGrupo
          data={data}
          isOpen={isConfirmOpen}
          modificarOpenChange={onOpenChange}
          onOpenChange={setIsConfirmOpen}
          fetchGrupos={fetchGrupos}
          fetchAlumnos={fetchAlumnos}
        />
      </Modal>
    )
  );
}

export default ModificarGrupo;
