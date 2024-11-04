import { prisma } from "@/utils/prisma";

/**
 * Función para obtener todos los docentes
 * @author Josue
 * @returns Todos los docentes
 */
export async function obtenerTodosDocentes() {
  return await prisma.docente.findMany();
}

/**
 * Función para crear un nuevo docente
 * @author Josue
 * @param data - Body que trae de la api, en el trae toda la información del docente
 * @returns Mensaje de confirmación o error
 */
export async function crearDocente(data: any) {
  // Se busca si un docente ya existe con esa CURP
  const docenteCURP = await prisma.docente.findFirst({
    where: {
      curp: data.curp,
    },
  });
  // Si existe uno se avisa
  if (docenteCURP) return { error: "Ya existe un docente con esa CURP" };

  // Se formatea la fecha al formato correcto
  const partes = data.fechaNac.split("-");
  const fecha = partes[2] + "/" + partes[1] + "/" + partes[0];

  // Se crea el docente
  const nuevoDocente = await prisma.docente.create({
    data: {
      nombre: data.nombre,
      aPaterno: data.aPaterno,
      aMaterno: data.aMaterno,
      telefono: data.telefono,
      fechaNac: fecha,
      curp: data.curp,
      correo: data.correo,
    },
  });

  if (!nuevoDocente) return "Hubo un error al registrar el docente.";

  return "registrado"; // Si llega hasta aquí es que todo está bien
}

/**
 * Función para actualizar docente
 * @author Josue
 * @param id - ID del docente a modificar
 * @param data - Información del docente que se modificará
 * @returns Mensaje de confirmación o error
 */
export async function actualizarDocente(id: number, data: any) {
  // Se verifica si existe un docente con la misma CURP

  // Se modifica la información del docente
  const docenteModificado = await prisma.docente.update({
    where: { id: Number(id) },
    data: {
      nombre: data.nombre,
      aPaterno: data.aPaterno,
      aMaterno: data.aMaterno,
      telefono: data.telefono,
      fechaNac: data.fechaNac,
      curp: data.curp,
      correo: data.correo
    },
  });

  if (!docenteModificado) return "Hubo un error al modificar al docente.";

  return "modificado"; // Se regresa mensaje de éxito
}

/**
 * Función para eliminar docente
 * @author Josue
 * @param id - ID del docente a eliminar
 * @returns Docente eliminado
 */
export async function eliminarDocente(id: number) {
  const idNumber: number = parseInt(id.toString());

  await prisma.salida.updateMany({
    where: {
      docenteId: idNumber,
    },
    data: {
      docenteId: undefined
    }
  });

  await prisma.grupo.updateMany({
    where: {
      docenteId: idNumber,
    },
    data: {
      docenteId: undefined,
    },
  });

  return await prisma.docente.delete({
    where: { id: Number(id) },
  });
}
