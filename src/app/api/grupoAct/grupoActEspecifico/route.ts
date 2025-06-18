import { obtenerCiertoGrupoActividad } from "@/Controllers/grupoActividadController";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export async function PATCH(req:NextRequest){
    try{
        const cookieStore = cookies();
                    const cookie = cookieStore.get("centroDeAtencionMultipleUser");
                    if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
                    const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
                    if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

        const data = await req.json()
        const response = await obtenerCiertoGrupoActividad(data.grupoId,data.actividadId)
        if(!response) return NextResponse.json({message:"Error al obtener la información."},{status:404})
        return NextResponse.json(response)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}