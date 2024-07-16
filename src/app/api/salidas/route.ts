import {NextRequest, NextResponse} from "next/server";
import {registrarSalida} from "@/Controllers/salidasController";

/**
 * Función POST para registrar una salida
 * @param request
 * @autor Jesus
 * @returns mensaje de confirmación o de error
 */
export async function POST(request:NextRequest){
    try{
        const data = await request.json()
        const response = await registrarSalida(data)
        if(response!=="registrado"){
            return NextResponse.json({message:response},{status:404})
        }
        return NextResponse.json({message:"Salida registrada exitosamente."},{status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}