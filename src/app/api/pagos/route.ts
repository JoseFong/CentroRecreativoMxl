import { obtenerPagos } from "@/Controllers/pagoController";
import { NextRequest, NextResponse } from "next/server";

/**
 * Función handler GET para obtener los pagos registrados
 * @author Fong
 * @param request request del user
 * @returns los pagos encontrados
 */
export async function GET(request:NextRequest){
    try{
        const pagos = await obtenerPagos()
        if(!pagos){
            return NextResponse.json({message:"Error al obtener los pagos."},{status:404})
        }
        return NextResponse.json(pagos)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}