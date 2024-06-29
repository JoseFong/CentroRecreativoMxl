import { obtenerActividades } from "@/Controllers/actividadController";
import { NextRequest, NextResponse } from "next/server";

/**
 * Función handler para obtener las actividades
 * @author Fong
 * @param request request del user
 * @returns respuesta del servidor
 */
export async function GET(request:NextRequest){
    try{
        const actividades = await obtenerActividades()
        if(!actividades){
            return NextResponse.json({message:"Error al obtener las actividades."},{status:404})
        }
        return NextResponse.json(actividades)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}