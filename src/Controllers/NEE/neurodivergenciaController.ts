import {prisma} from "@/utils/prisma"
import { FUNCTIONS_CONFIG_MANIFEST } from "next/dist/shared/lib/constants"


/**
 * Función para obtener docentes de una sucursal
 * @author Daniela
 * @returns todas las neurodivergencias
 */
export async function obtenerTodasNEE() {
    return prisma.neurodivergencia.findMany();
}


/**
 * Función para registrar una nueva neurodivergencia
 * @author Daniela
 * @param data - Datos de la neurodivergencia a registrar
 * @returns La neurodivergencia registrada o un mensaje de neurodivergencia repetida
 */
export async function registrarNEE(data:any) {
    const neeTemp = await prisma.neurodivergencia.findFirst({
        where: {
            nombre: data.nombre.toUpperCase()
        }
    })
    if(!neeTemp){
        return prisma.neurodivergencia.create({
            data: {
                nombre: data.nombre.toUpperCase()
            }
        });
    } else {
        return "Neurodivergencia_repetida"
    }
}

/**
 * Función para eliminar una neurodivergencia por su ID
 * @author Daniela
 * @param id - ID de la neurodivergencia a eliminar
 * @returns La neurodivergencia eliminada
 */
export async function eliminarNEE(id: number) {
    // Desvincula a todos los alumnos de la neurodivergencia
    await prisma.alumnoNEE.deleteMany({
        where: {
            neurodivergenciaId: id
        }
    });

    // Elimina la neurodivergencia
    return prisma.neurodivergencia.delete({
        where: {
            id: id
        }
    });
}

/**
 * Función para actualizar una neurodivergencia por su ID
 * @author Daniela
 * @param id - ID de la neurodivergencia a actualizar
 * @param data - Datos actualizados de la neurodivergencia
 * @returns La neurodivergencia actualizada
 */
export async function actualizarNEE(id: number, data: {nombre: string}) {
    try {
        const neurodivergencia = await prisma.neurodivergencia.update({
            where: {id: id},
            data: data
        });
        return neurodivergencia;
    } catch (error) {
        throw error;
    }
}
