import { obtenerTodosDocentes, registrarDocente } from "@/Controllers/docenteController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
    try{
        const docentes = await obtenerTodosDocentes()
        if(!docentes){
            return NextResponse.json({message:"Error al obtener los docentes."},{status:404})
        }
        return NextResponse.json(docentes)
    }catch(e:any){
        return NextResponse.json({response:e.message},{status:500})
    }
}

export async function POST(request:NextRequest){
    try{
        const data = await request.json()
        const docente = await registrarDocente(data)
        if(!docente){
            return NextResponse.json({message:"Hubo un error al registrar al docente."},{status:404})
        }
        if(docente==="usuario_repetido"){
            return NextResponse.json({message:"Nombre de usuario inválido."},{status:404})
        }
        return NextResponse.json(docente)
    }catch(e:any){
        
      console.log(e.message);
        return NextResponse.json({message:e.message},{status:500})
    }
}