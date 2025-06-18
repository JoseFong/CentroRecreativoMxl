import { eliminarGrupoAct, modificarHorario, obtenerGrupoActividades } from "@/Controllers/grupoActividadController";
import { asignarActAGrupo } from "@/Controllers/grupoController";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export async function POST(req:NextRequest){
    try{
        const cookieStore = cookies();
                    const cookie = cookieStore.get("centroDeAtencionMultipleUser");
                    if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
                    const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
                    if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

        const data = await req.json()
        const response = await asignarActAGrupo(data)
        if(!response) return NextResponse.json({message:"Error al asignar al grupo."},{status:404})
        if(response!=="registrado")
            return NextResponse.json({message:response},{status:404})
        return NextResponse.json({message:"exito"},{status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

export async function GET(req:NextRequest){
    try{
        const response = await obtenerGrupoActividades()
        if(!response) return NextResponse.json({message:"Error al conseguir la información."},{status:404})
        return NextResponse.json(response)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

export async function PATCH(req:NextRequest){
    try{
        const data = await req.json()
        const response = await modificarHorario(data)
        if(!response) return NextResponse.json({message:"Error al modificar el horario."},{status:404})
        if(response!=="modificado") return NextResponse.json({message:response},{status:400})
        return NextResponse.json({message:"Exito"},{status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}