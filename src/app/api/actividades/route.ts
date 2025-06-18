import { obtenerActividades, registrarActividad } from "@/Controllers/actividadController";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

/**
 * Función handler para obtener las actividades
 * @author Fong
 * @param request request del user
 * @returns respuesta del servidor
 */
export async function GET(request:NextRequest){
    try{
        const cookieStore = cookies();
            const cookie = cookieStore.get("centroDeAtencionMultipleUser");
            if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
            const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
            if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

        const actividades = await obtenerActividades()
        if(!actividades){
            return NextResponse.json({message:"Error al obtener las actividades."},{status:404})
        }
        return NextResponse.json(actividades)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * Función para registrar una actividad
 * @author Fong
 * @param req 
 * @returns 
 */
export async function POST(req:NextRequest){
    try{
        const cookieStore = cookies();
            const cookie = cookieStore.get("centroDeAtencionMultipleUser");
            if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
            const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
            if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

        const data = await req.json()
        const response = await registrarActividad(data)
        if(!response) return NextResponse.json({message:"Error al registrar la actividad."},{status:404})
        if(response!=="registrado") return NextResponse.json({message:response},{status:400})
        return NextResponse.json({message:"Exito"},{status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}