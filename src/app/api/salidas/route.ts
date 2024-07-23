import {NextRequest, NextResponse} from "next/server";
import {obtenerSalidas, registrarSalida} from "@/Controllers/salidasController";

/**
 * Funcion GET para obtener todas las sailidas
 * @autor Jesus
 * @returns array de salidas
 */
export async function GET(){
    try{
        const response = await obtenerSalidas()
        return NextResponse.json(response)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

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