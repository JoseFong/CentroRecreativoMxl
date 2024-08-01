import { eliminarGrupoAct } from "@/Controllers/grupoActividadController"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(req:NextRequest){
    try{
        const data = await req.json()
        const response = await eliminarGrupoAct(data.grupoId,data.actividadId)
        if(!response) return NextResponse.json({message:"Error al realizar la operación."},{status:404})
        return NextResponse.json(response)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}