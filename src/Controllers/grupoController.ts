import {prisma} from "@/utils/prisma"

/**
 * Función para obtener todos los grupos
 * @author Fong
 * @returns todos los grupos
 */
export async function obtenerGrupos(){
    return await prisma.grupo.findMany()
}