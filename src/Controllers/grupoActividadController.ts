import {prisma} from "@/utils/prisma"
import { verificarTraslape } from "./grupoController"

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

export async function obtenerGrupoActDeAct(id:number){
    return prisma.grupoActividad.findMany({
        where: {
            actividadId: id
        }
    })
}

export async function modificarHorario(data:any){
    const horario:string = data.horario
    const grupoId:number = parseInt(data.grupoId)
    const actividadId:number = parseInt(data.actividadId)

    const registro = await prisma.grupoActividad.findFirst({
        where: {
            grupoId: grupoId,
            actividadId: actividadId
        }
    })

    if(registro){

    

    const traslape = await verificarTraslape(data.horario,data.grupoId,registro.id)
    if(traslape) return "El grupo ya tiene otra actividad a las horas establecidas."
    
        await prisma.grupoActividad.update({
            where: {
                id: registro.id
            },
            data: {
                horario: data.horario
            }
        })
        return "modificado"
    }else{
        return "Hubo un error al modificar el horario."
    }
    
}