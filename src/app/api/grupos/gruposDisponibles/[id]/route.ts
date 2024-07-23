import { obtenerGruposDisponibles } from "@/Controllers/grupoController";
import { NextRequest, NextResponse } from "next/server";

interface Params{
    id: string
}

export async function GET(req:NextRequest,{params}:{params:Params}){
    try{
        const id:number = parseInt(params.id)
        const response = await obtenerGruposDisponibles(id)
        if(!response) return NextResponse.json({message:"Error al obtener los grupos."},{status:404})
        return NextResponse.json(response)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}