import { eliminarActividad, modificarActividad } from "@/Controllers/actividadController";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

interface Params{
    id:string
}

export async function DELETE(req:NextRequest,{params}:{params:Params}){
    try{
        const cookieStore = cookies();
                    const cookie = cookieStore.get("centroDeAtencionMultipleUser");
                    if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
                    const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
                    if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

        const id:number = parseInt(params.id)
        const actividad = await eliminarActividad(id)
        if(!actividad){
            return NextResponse.json({message:"Error al eliminar la actividad."},{status:404})
        }
        return NextResponse.json(actividad)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }

}

/**
 * Función para modificar la información de una actividad
 * @author Fong
 * @param req 
 * @param param1 
 * @returns 
 */
export async function PATCH(req:NextRequest,{params}:{params:Params}){
    try{
            const cookieStore = cookies();
            const cookie = cookieStore.get("centroDeAtencionMultipleUser");
            if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
            const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
            if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

        const id:number = parseInt(params.id)
        const data = await req.json()
        const response = await modificarActividad(id,data)
        if(!response) return NextResponse.json({message:"Error al modificar la actividad."},{status:404})
        if(response!=="modificado") return NextResponse.json({message:response},{status:404})
        return NextResponse.json({message:"exito"},{status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}