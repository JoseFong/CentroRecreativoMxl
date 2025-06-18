import { obtenerGruposDeActividad } from "@/Controllers/grupoController";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";


interface Params {
    id: string
}

/**
 * Función para obtener los grupos de una actividad
 * @author Fong
 * @param req 
 * @param param1 
 * @returns 
 */
export async function GET(req:NextRequest,{params}:{params:Params}){
    try{
        const cookieStore = cookies();
                    const cookie = cookieStore.get("centroDeAtencionMultipleUser");
                    if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
                    const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
                    if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

        const id:number = parseInt(params.id)
        const grupos = await obtenerGruposDeActividad(id)
        if(!grupos) return NextResponse.json({message:"Error al obtener los grupos."},{status:404})
        return NextResponse.json(grupos) 
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}