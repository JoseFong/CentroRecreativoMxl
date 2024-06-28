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
