import { eliminarPago } from "@/Controllers/pagoController";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";

interface Params{
    id:string
}

/**
 * Función handler para eliminar un pago
 * @author Fong
 * @param request request del user
 * @param param1 id del pago
 * @returns respuesta del server
 */
export async function DELETE(request:NextRequest,{params}:{params:Params}){
    try{
        const cookieStore = cookies();
                    const cookie = cookieStore.get("centroDeAtencionMultipleUser");
                    if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
                    const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
                    if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

        const id:number = parseInt(params.id)
        const pago = await eliminarPago(id)
        if(!pago) return NextResponse.json({message:"Error al eliminar el pago."},{status:404})
        return NextResponse.json(pago)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}