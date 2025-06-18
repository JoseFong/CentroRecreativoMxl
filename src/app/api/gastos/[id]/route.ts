import {NextRequest, NextResponse} from "next/server";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";
import {modificarGasto} from "@/Controllers/gastoController";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

/**
 * Función handler para modificar la información de un gasto
 * @autor Jesus
 * @param request datos del gasto
 * @param param1 id del gasto
 * @returns respuesta del servidor
 */
export async function PATCH(request:NextRequest,{params}:{params:Params}){
    try{
const cookieStore = cookies();
            const cookie = cookieStore.get("centroDeAtencionMultipleUser");
            if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
            const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
            if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

        const id = parseInt(params.id)
        const data = await request.json()
        const response = await modificarGasto(data,id)
        if(!response){
            return NextResponse.json({message:"Hubo un error al modificar la información del gasto."})
        }
        // @ts-ignore
        if(response!=="modificado"){
            return NextResponse.json({message:response},{status:404})
        }
        return NextResponse.json({message:"Gasto modificado exitosamente."},{status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}