import {prisma} from "@/utils/prisma"

/**
 * Función para obtener todos los grupo
 * @autor Jesus
 * @returns todos los grupo en la base de datos
 */
export async function obtenerGrupos(){
    return prisma.grupo.findMany();
}

/**
 * Función para registrar un nuevo grupo
 * @autor Jesus
 * @param data del grupo a registrar
 * @returns mensaje de error o confirmación
 */
export async function registrarGrupo(data:any){
    const nombre = data.nombre.toUpperCase();
    const docenteId = data.docenteId ? parseInt(data.docenteId) : null;

    //Validación para que no se repita el nombre del grupo
    const grupo = await prisma.grupo.findFirst({
        where: {
            nombre: nombre
        }
    })
    if(grupo) return "Ya existe otro grupo con ese nombre"

    await prisma.grupo.create({
        data:{
            nombre:nombre
        }
    })

    const grupoRegistrado = await prisma.grupo.findFirst({
        where:{
            nombre: nombre
        }
    })

    if(!grupoRegistrado) return "Hubo un error al registrar el grupo"

    if(docenteId){
        await prisma.grupo.update({
            where:{
                id: grupoRegistrado.id
            },
            data:{
                docenteId: docenteId
            }
        })
    }
    return "registrado"
}

/**
 * Función para actualizar un grupo
 * @autor Jesus
 * @param data del grupo a actualizar
 * @returns mensaje de error o confirmación
 */
export async function actualizarGrupo(data:any) {
    const id = parseInt(data.id)
    const nombre = data.nombre.toUpperCase();
    const docenteId = data.docenteId ? parseInt(data.docenteId) : null;

    //Validación para que no se repita el nombre del grupo
    const grupo = await prisma.grupo.findFirst({
        where: {
            nombre: nombre
        }
    })
    if (grupo && grupo.id !== id) return "Ya existe otro grupo con ese nombre"

    await prisma.grupo.update({
        where: {
            id: id
        },
        data: {
            nombre: nombre
        }
    })

    // Desasignar el docente
    await prisma.grupo.update({
        where: {
            id: id
        },
        data: {
            docenteId: null
        }
    })

    // Volvemos a asignar al docente o al nuevo docente
    if (docenteId && docenteId > 0) {
        await prisma.grupo.update({
            where: {
                id: id
            },
            data: {
                docenteId: docenteId
            }
        })
    }

    // Quitar a todos los alumnos
    await prisma.alumno.updateMany({
        where:{
            grupoId: id
        },
        data:{
            grupoId: null
        }
    })

    // Asignar a los alumnos seleccionados
    if(data.alumnosIds){
        const alumnos = await prisma.alumno.findMany({
            where:{
                id:{
                    in: data.alumnosIds
                }
            }
        })
        for(const alumno of alumnos){
            await prisma.alumno.update({
                where:{
                    id: alumno.id
                },
                data:{
                    grupoId: id
                }
            })
        }
    }

    return "actualizado"
}


