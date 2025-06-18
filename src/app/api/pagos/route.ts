import { eliminarPagosDeOtrosAnos, obtenerPagos, registrarPago } from "@/Controllers/pagoController";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";

/**
 * Función handler GET para obtener los pagos registrados
 * @author Fong
 * @param request request del user
 * @returns los pagos encontrados
 */
export async function GET(request:NextRequest){
    try{
        const cookieStore = cookies();
                    const cookie = cookieStore.get("centroDeAtencionMultipleUser");
                    if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
                    const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
                    if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

        await eliminarPagosDeOtrosAnos()
        const pagos = await obtenerPagos()
        if(!pagos){
            return NextResponse.json({message:"Error al obtener los pagos."},{status:404})
        }
        return NextResponse.json(pagos)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * Función handler para registrar un pago
 * @author Fong
 * @param request información del pago
 * @returns respuesta del servidor
 */
export async function POST(request:NextRequest){
    try{
        const cookieStore = cookies();
                    const cookie = cookieStore.get("centroDeAtencionMultipleUser");
                    if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
                    const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
                    if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

        const data = await request.json()
        const response = await registrarPago(data)
        if(!response){
            return NextResponse.json({message:"Error al registrar el pago."})
        }
        if(response!=="registrado"){
            return NextResponse.json({message:response},{status:400})
        }
        return NextResponse.json({message:"Pago registrado exitosamente."},{status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}