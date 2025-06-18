import { obtenerNEEsDeAlumno } from "@/Controllers/neeController";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

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
        const cookieStore = cookies();
                    const cookie = cookieStore.get("centroDeAtencionMultipleUser");
                    if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
                    const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
                    if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

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