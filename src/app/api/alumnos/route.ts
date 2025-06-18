import { obtenerAlumnos, registrarAlumno } from "@/Controllers/alumnoController";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

/**
 * Función GET para alumnos
 * @param request request http del usuario
 * @returns respuesta del servidor
 */
export async function GET(request:NextRequest){
    try{
const cookieStore = cookies();
            const cookie = cookieStore.get("centroDeAtencionMultipleUser");
            if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
            const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
            if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

        const alumnos = await obtenerAlumnos()
        if(!alumnos){
            return NextResponse.json({message:"Error al obtener a los alumnos."},{status:404})
        }
        return NextResponse.json(alumnos)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

export async function POST(request:NextRequest){
    try{
const cookieStore = cookies();
            const cookie = cookieStore.get("centroDeAtencionMultipleUser");
            if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
            const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
            if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

        const data = await request.json()
        const response = await registrarAlumno(data)
        if(!response){
            return NextResponse.json({message:"Error al registrar al alumno."},{status:404})
        }
        if(response!=="registrado"){
            return NextResponse.json({message:response},{status:400})
        }
        return NextResponse.json({message:"Alumno registrado exitosamente."},{status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

