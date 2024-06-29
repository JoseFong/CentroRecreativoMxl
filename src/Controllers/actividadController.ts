import {prisma} from "@/utils/prisma"

/**
 * Función para obtener todas las actividades
 * @author Fong
 * @returns actividades
 */
export async function obtenerActividades(){
    return await prisma.actividad.findMany()
}