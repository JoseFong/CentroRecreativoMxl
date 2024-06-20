import {prisma} from "@/utils/prisma"

/**
 * Función para obtener todas las neurodivergencias
 * @author Fong
 * @returns Todas las neurodivergencias
 */
export async function obtenerNEEs(){
    return await prisma.neurodivergencia.findMany()
}

/**
 * Función para encontrar neurodivergencias que tenga un alumno
 * @author Fong
 * @param id id del alumno
 * @returns neurodivergencias que tenga
 */
export async function obtenerNEEsDeAlumno(id:number){
    //Se obtienen los registros de alumnoNEE que involucren al alumno
    const alumnoNEEs = await prisma.alumnoNEE.findMany({
        where: {
            alumnoId: id
        }
    })

    //Por cada registro alumnoNEE se guarda la id de la neurodivergencia en un arreglo.
    let ids:number[] = []
    for(let i=0;i<alumnoNEEs.length;i++){
        ids.push(alumnoNEEs[i].neurodivergenciaId)
    }

    /*Usando el arreglo con las ids de las neurodivergencias, se encuentran todas esas
     neurodivergencias y se regresan*/
    const nees =  await prisma.neurodivergencia.findMany({
        where: {
            id: {
                in: ids
            }
        }
    })

    return nees
}