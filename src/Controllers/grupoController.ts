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
  const traslape = await verificarTraslape(data.horario,data.grupoId)

  if(traslape) return "Este grupo ya tiene una actividad a esta hora."

  await prisma.grupoActividad.create({
    data: {
      horario: data.horario,
      grupoId: data.grupoId,
      actividadId: data.actividadId
    }
  })

  return "registrado"
}

const verificarTraslape = async (horario:string,grupoId:number) => {
  const registros = await prisma.grupoActividad.findMany({
    where: {
      grupoId: grupoId
    }
  })

  let traslapetest = false

  registros.map((reg:any)=>{
    const horarioDeClase = reg.horario
    const traslape = verificarTraslapeEntreDosHorarios(horarioDeClase,horario)
    if(traslape){
      traslapetest = true
    }
  })

  if(traslapetest) return true
  return false
}

interface Dia {
  nombre: string,
  inicio: string,
  fin: string
}

const verificarTraslapeEntreDosHorarios = (horario1: string,horario2:string) => {
  let dias:string[] = horario1.split("..")
  
  let h1o:Dia[] = []
  let h2o:Dia[] = []

  dias.map((d:any)=>{
    let h:string[] = d.split(".")
    const dia:Dia = {nombre:h[0],inicio:h[1],fin:h[2]}
    h1o.push(dia)
  })

  dias = horario2.split("..")
  dias.map((d:any)=>{
    let h = d.split(".")
    const dia:Dia = {nombre:h[0],inicio:h[1],fin:h[2]}
    h2o.push(dia)
  })

  const nombres:string[] = ["lunes","martes","miercoles","jueves","viernes","sabado"]


  let traslape = false
  nombres.map((nombre:string)=>{
    if(h1o.some((d:Dia)=>d.nombre===nombre)){
      if(h2o.some((d:Dia)=>d.nombre===nombre)){
        const d1 = h1o.find((d:Dia)=>d.nombre===nombre)
        const d2 = h2o.find((d:Dia)=>d.nombre===nombre)
        if(d1 && d2){
          const inicio1:number = parseInt(d1.inicio.replace(":",""))
          const fin1:number = parseInt(d1.fin.replace(":",""))
          const inicio2:number = parseInt(d2.inicio.replace(":",""))
          const fin2:number = parseInt(d2.fin.replace(":",""))
        

          if(inicio1===inicio2) traslape = true
          if(inicio2>inicio1){
            if(inicio2<=fin1){
              traslape = true
            }
          }
          if(inicio2<inicio1){
            if(fin2>inicio1){
              traslape = true
            }
          }
        }
      }
    }
  })
  if(traslape) return true
  return false
}