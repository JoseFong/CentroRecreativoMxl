import { obtenerGrupoActDeAct } from "@/Controllers/grupoActividadController";
import { NextRequest, NextResponse } from "next/server";
import {Grupo} from "@prisma/client"

interface Params{
    id: string
}

export async function GET(req:NextRequest,{params}:{params:Params}){
    try{
        const id:number = parseInt(params.id)
        const response = await obtenerGrupoActDeAct(id)
        if(!response) return NextResponse.json({message:"Error al conseguir los grupos."},{status:404})
        return NextResponse.json(response)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}