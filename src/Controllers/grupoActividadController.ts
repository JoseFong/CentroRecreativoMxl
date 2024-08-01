import {prisma} from "@/utils/prisma"

export async function obtenerGrupoActividades(){
    return await prisma.grupoActividad.findMany()
}

export async function obtenerCiertoGrupoActividad(grupoId:number,actividadId:number){
    return await prisma.grupoActividad.findFirst({
        where: {
            grupoId: grupoId,
            actividadId: actividadId
        }
    })
}

export async function eliminarGrupoAct(grupoId:number,actividadId:number){
    return await prisma.grupoActividad.deleteMany({
        where: {
            grupoId: grupoId,
            actividadId: actividadId
        }
    })
}