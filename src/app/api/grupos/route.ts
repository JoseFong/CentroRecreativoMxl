import { obtenerGrupos, registrarGrupo } from "@/Controllers/grupoController";
import { NextRequest, NextResponse } from "next/server";

/**
 * Función handler par obtener los grupos
 * @author Fong
 * @param request request del user
 * @returns los grupos
 */
export async function GET(request:NextRequest){
    try{
        const grupos = await obtenerGrupos()
        if(!grupos){
            return NextResponse.json({message:"Error al obtener los grupos."},{status:404})
        }
        return NextResponse.json(grupos)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/*
    * Función handler para registrar un grupo
    * @autor Jesus
    * @param request request del user
    * @returns el grupo registrado
    * @returns error si no se pudo registrar el grupo
 */
export async function POST(request:NextRequest){
    try{
        const data = await request.json()
        const response = await registrarGrupo(data)
        if(!response){
            return NextResponse.json({message:"Error al registrar el grupo."},{status:404})
        }

        if(response === "Ya existe otro grupo con ese nombre"){
            return NextResponse.json({message:"Ya existe otro grupo con ese nombre."},{status:400})
        }

        return NextResponse.json(response)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}
