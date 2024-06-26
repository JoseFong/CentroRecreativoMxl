import {prisma} from "@/utils/prisma"

/**
 * Función para obtener todos los pagos
 * @author Fong
 * @returns todos los pagos
 */
export async function obtenerPagos() {
    return await prisma.pago.findMany()
}