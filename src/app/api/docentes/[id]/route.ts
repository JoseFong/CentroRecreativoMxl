import { eliminarDocente } from "@/Controllers/docenteController";
import { NextRequest, NextResponse } from "next/server";

interface Params{
    id: string
}

export async function DELETE(request:NextRequest,{params}:{params:Params}){
    try{
        const idNum:number = parseInt(params.id)
        const docente = await eliminarDocente(idNum)
        if(!docente){
            return NextResponse.json({message:"Hubo un error al eliminar al docente."},{status:404})
        }
        return NextResponse.json(docente)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}