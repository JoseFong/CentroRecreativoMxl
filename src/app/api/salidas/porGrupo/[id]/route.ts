import {NextRequest, NextResponse} from "next/server";
import {obtenerSalidasDeGrupo} from "@/Controllers/salidasController";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

/**
 * Función GET para SALIDA
 * @param request request http del usuario
 * @autor Jesus
 * @returns respuesta del servidor
 */
export async function GET(request:NextRequest, {params}:{params:Params}){
    try{
        const id = parseInt(params.id)

        const salidas = await obtenerSalidasDeGrupo(id)
        if(!salidas){
            return NextResponse.json({message:"Error al obtener las salidas."},{status:404})
        }
        return NextResponse.json(salidas)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}