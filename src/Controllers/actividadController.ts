import {prisma} from "@/utils/prisma"

/**
 * Función para obtener todas las actividades
 * @author Fong
 * @returns actividades
 */
export async function obtenerActividades(){
    return await prisma.actividad.findMany()
}

/**
 * Función para eliminar una actividad
 * @author Fong
 * @param id id de la actividad
 * @returns la actividad eliminada
 */
export async function eliminarActividad(id:number){
    await prisma.grupoActividad.deleteMany({
        where: {
            actividadId:id
        }
    })

    return await prisma.actividad.delete({
        where: {
            id:id
        }
    })
}

/**
 * Función para registrar una actividad
 * @author Fong
 * @param data información de la actividad
 * @returns mensaje de error o confirmación
 */
export async function registrarActividad(data:any){
    const actividad = await prisma.actividad.findFirst({
        where: {
            nombre: data.nombre
        }
    })
    if(!actividad){
        const actividadRegistrada = await prisma.actividad.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion
            }
        })
        if(!actividadRegistrada) return "Error al registrar la actividad."
        return "registrado"
    }else{
        return "Ya existe otra actividad con este nombre."
    }
}

/**
 * Función para modifica la información de una actividad
 * @author Fong
 * @param id id de la actividad a modificar
 * @param data datos a modificar
 * @returns mensaje de error o exito
 */
export async function modificarActividad(id:number,data:any){
    const actividad = await prisma.actividad.findFirst({
        where:{
            nombre: data.nombre
        }
    })
    if(actividad && actividad.id!==id) return "Ya existe otra actividad con ese nombre."
    const actividadMod = await prisma.actividad.update({
        where:{
            id: id
        },
        data:{
            nombre:data.nombre,
            descripcion:data.descripcion
        }
    })
    if(!actividadMod) return "Error al modificar la actividad."
    return "modificado"
}   