import { prisma } from "@/utils/prisma";

/**
 * Función para obtener todos los grupo
 * @autor Jesus
 * @returns todos los grupo en la base de datos
 */
export async function obtenerGrupos() {
  return prisma.grupo.findMany();
}

/**
 * Función para registrar un nuevo grupo
 * @autor Jesus
 * @param data del grupo a registrar
 * @returns mensaje de error o confirmación
 */
export async function registrarGrupo(data: any) {
  const nombre = data.nombre.toUpperCase();
  const docenteId = data.docenteId ? parseInt(data.docenteId) : null;

  // Validación para que no se repita el nombre del grupo
  const grupo = await prisma.grupo.findFirst({
    where: {
      nombre: nombre,
    },
  });
  if (grupo) return "Ya existe otro grupo con ese nombre";

  // Crear el nuevo grupo
  const grupoRegistrado = await prisma.grupo.create({
    data: {
      nombre: nombre,
    },
  });

  if (!grupoRegistrado) return "Hubo un error al registrar el grupo";

  const grupoId = grupoRegistrado.id;

  if (docenteId) {
    await prisma.grupo.update({
      where: {
        id: grupoId,
      },
      data: {
        docenteId: docenteId,
      },
    });
  }

  if (data.selectedAlumnosIds) {
    const alumnos = await prisma.alumno.findMany({
      where: {
        id: {
          in: data.selectedAlumnosIds,
        },
      },
    });
    for (const alumno of alumnos) {
      await prisma.alumno.update({
        where: {
          id: alumno.id,
        },
        data: {
          grupoId: grupoId,
        },
      });
    }
  }

  return "registrado";
}

/**
 * Función para actualizar un grupo
 * @autor Jesus
 * @param data del grupo a actualizar
 * @returns mensaje de error o confirmación
 */
export async function actualizarGrupo(data: any) {
  const id = parseInt(data.id);
  const nombre = data.nombre.toUpperCase();
  const docenteId = data.docenteId ? parseInt(data.docenteId) : null;

  //Validación para que no se repita el nombre del grupo
  const grupo = await prisma.grupo.findFirst({
    where: {
      nombre: nombre,
    },
  });
  if (grupo && grupo.id !== id) return "Ya existe otro grupo con ese nombre";

  await prisma.grupo.update({
    where: {
      id: id,
    },
    data: {
      nombre: nombre,
    },
  });

  // Desasignar el docente
  await prisma.grupo.update({
    where: {
      id: id,
    },
    data: {
      docenteId: null,
    },
  });

  // Volvemos a asignar al docente o al nuevo docente
  if (docenteId && docenteId > 0) {
    await prisma.grupo.update({
      where: {
        id: id,
      },
      data: {
        docenteId: docenteId,
      },
    });
  }

  // Quitar a todos los alumnos
  await prisma.alumno.updateMany({
    where: {
      grupoId: id,
    },
    data: {
      grupoId: null,
    },
  });

  // Asignar a los alumnos seleccionados
  if (data.alumnosIds) {
    const alumnos = await prisma.alumno.findMany({
      where: {
        id: {
          in: data.alumnosIds,
        },
      },
    });
    for (const alumno of alumnos) {
      await prisma.alumno.update({
        where: {
          id: alumno.id,
        },
        data: {
          grupoId: id,
        },
      });
    }
  }

  return "actualizado";
}

/**
 * Función para encontrar los grupos inscritos en una actividad
 * @author Fong
 * @param id id de la actividad
 * @returns los grupos que están registrados en esa actividad
 */
export async function obtenerGruposDeActividad(id:number){
  const registros = await prisma.grupoActividad.findMany({
    where:{
      actividadId:id
    }
  })

  let ids:number[] = []
  registros.map((r:any)=>ids.push(r.grupoId))

  return await prisma.grupo.findMany({
    where: {
      id: {
        in: ids
      }
    }
  })
}

export async function obtenerGruposDisponibles(id:number){
  const registros = await prisma.grupoActividad.findMany({
    where: {
      actividadId: id
    }
  })

  let ids:number[] = []
  registros.map((reg:any)=>{ids.push(reg.grupoId)})

  const grupos = await prisma.grupo.findMany()
  let gruposIds:number[] = []
  grupos.map((gr:any)=>{gruposIds.push(gr.id)})

  const gruposAObtenerId:number[] = gruposIds.filter(item=>!ids.includes(item))

  return await prisma.grupo.findMany({
    where: {
      id: {
        in: gruposAObtenerId
      }
    }
  })
}

export async function asignarActAGrupo(data:any){
  return await prisma.grupoActividad.create({
    data: {
      horario: data.horario,
      grupoId: data.grupoId,
      actividadId: data.actividadId
    }
  })
}