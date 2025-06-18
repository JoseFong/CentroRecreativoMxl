import { obtenerGrupoActDeGrupo } from "@/Controllers/grupoActividadController";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import {cookies} from "next/headers"

interface Params{
    id: string
}

export async function GET(req:NextRequest,{params}:{params:Params}){
    try{
const cookieStore = cookies();
            const cookie = cookieStore.get("centroDeAtencionMultipleUser");
            if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
            const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
            if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

        const id:number = parseInt(params.id)
        const response = await obtenerGrupoActDeGrupo(id)
        if(!response) return NextResponse.json({message:"Error al encontrar la información."},{status:404})
        return NextResponse.json(response)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}