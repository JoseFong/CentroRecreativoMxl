import { eliminarAlumno } from "@/Controllers/alumnoController";
import { NextRequest, NextResponse } from "next/server";

interface Params{
    id:string
}

/**
 * Función handler para eliminar un alumno
 * @author Fong
 * @param request 
 * @param param1 id del alumno
 * @returns alumno eliminado
 */
export async function DELETE(request:NextRequest,{params}:{params:Params}){
    try{
        const id = parseInt(params.id)
        const alumno = await eliminarAlumno(id)
        if(!alumno){
            return NextResponse.json({message:"Error al eliminar al alumno."},{status:404})
        }
        return NextResponse.json(alumno)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}