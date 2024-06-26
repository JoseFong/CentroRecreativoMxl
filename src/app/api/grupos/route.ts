import { obtenerGrupos } from "@/Controllers/grupoController";
import { NextRequest, NextResponse } from "next/server";

/**
 * Función handler par obtener los grupos
 * @author Fong
 * @param request request del user
 * @returns los grupos
 */
export async function GET(request:NextRequest){
    try{
        const grupos = await obtenerGrupos()
        if(!grupos){
            return NextResponse.json({message:"Error al obtener los grupos."},{status:404})
        }
        return NextResponse.json(grupos)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}