import { eliminarAlumno, modificarAlumno } from "@/Controllers/alumnoController";
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

/**
 * Función handler para modificar la información de un alumno
 * @author Fong
 * @param request datos del alumno
 * @param param1 id del alumno
 * @returns respuesta del servidor
 */
export async function PATCH(request:NextRequest,{params}:{params:Params}){
    try{
        const id = parseInt(params.id)
        const data = await request.json()
        const response = await modificarAlumno(data,id)
        if(!response){
            return NextResponse.json({message:"Hubo un error al modificar la información del alumno."})
        }
        if(response!=="modificado"){
            return NextResponse.json({message:response},{status:404})
        }
        return NextResponse.json({message:"Alumno modificado exitosamente."},{status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}