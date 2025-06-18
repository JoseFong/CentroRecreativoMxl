import { obtenerNEEsDeAlumno } from "@/Controllers/neeController";
import { NextRequest, NextResponse } from "next/server";

interface Params{
    id: string
}

/**
 * Handler para obtener las neurodivergencias de un alumno
 * @author Fong
 * @param request 
 * @param param1 la id del alumno
 * @returns neurodivergencias del alumno
 */
export async function GET(request:NextRequest,{params}:{params:Params}){
    try{
        const id = parseInt(params.id)
        const nees = await obtenerNEEsDeAlumno(id)
        if(!nees){
            return NextResponse.json({message:"Error al obtener las neurodivergencias."},{status:404})
        }
        return NextResponse.json(nees)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}