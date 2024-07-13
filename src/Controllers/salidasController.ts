import {prisma} from "@/utils/prisma";

/**
 * Función para obtener las salidas de cierto grupo
 * @autor Jesus
 * @param id id del grupo
 * @returns Salidas de cierto alumno
 */
export async function obtenerSalidasDeGrupo(id:number) {
    return prisma.salida.findMany({
        where: {
            grupoId: id
        }
    })
}

/**
 * Función para registrar una salida
 * @autor Jesus
 * @param data información de la salida
 * @returns mensaje de error o éxito
 */
export async function registrarSalida(data:any) {
    const grupoId:number = parseInt(data.grupoId)
    const docenteId:number = parseInt(data.docenteId)
    const fecha = data.fecha
    const hora = data.hora
    const nombre = data.nombre

    //Validaciones
    if(Date.now() > Date.parse(fecha)) return "La fecha no puede ser anterior a la actual"

    await prisma.salida.create({
        data: {
            grupoId: grupoId,
            docenteId: docenteId,
            fecha: fecha,
            horaDeSalida: hora,
            nombre: nombre
        }
    });

    return "registrado";
}

/**
 * Función para modificar una salida
 * @autor Jesus
 * @param data información de la salida
 * @param id id de la salida
 * @returns mensaje de error o éxito
 */
export async function modificarSalida(data:any, id:number) {
    const grupoId:number = parseInt(data.grupoId)
    const docenteId:number = parseInt(data.docenteId)
    const fecha = data.fecha
    const hora = data.hora
    const nombre = data.nombre

    //Validaciones
    if(Date.now() > Date.parse(fecha)) return "La fecha no puede ser anterior a la actual"

    await prisma.salida.update({
        where: {
            id: id
        },
        data: {
            grupoId: grupoId,
            docenteId: docenteId,
            fecha: fecha,
            horaDeSalida: hora,
            nombre: nombre
        }
    })

    return "modificado";
}

/**
 * Función para eliminar una salida
 * @autor Jesus
 * @param id id de la salida
 * @returns mensaje de error o éxito
 */
export async function eliminarSalida(id:number) {

    //Se desvinculan el grupo y el docente
    await prisma.salida.update({
        where: {
            id: id
        },
        data: {
            grupoId: -1,
            docenteId: -1
        }
    })

    await prisma.salida.delete({
        where: {
            id: id
        }
    })

    return "eliminado"
}