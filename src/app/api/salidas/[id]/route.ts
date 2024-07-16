import {NextRequest, NextResponse} from "next/server";
import {modificarSalida, obtenerSalidasDeGrupo} from "@/Controllers/salidasController";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";

/**
 * Función POST para actualizar una salida de un grupo
 * @param request
 * @param id de la salida
 * @autor Jesus
 * @returns mensaje de confirmación o de error
 */
export async function PATCH(request:NextRequest,{params}:{params:Params}){
    try{
        const id = parseInt(params.id)
        const data = await request.json()
        const response = await modificarSalida(data,id)
        if(!response){
            return NextResponse.json({message:"Hubo un error al modificar la información de la salida."})
        }
        // @ts-ignore
        if(response!=="modificado"){
            return NextResponse.json({message:response},{status:404})
        }
        return NextResponse.json({message:"Salida modificada exitosamente."},{status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * Función DELETE para eliminar una salida de un grupo
 * @param request request http del usuario
 * @autor Jesus
 * @returns respuesta del servidor
 */
export async function DELETE(request:NextRequest,{params}:{params:Params}){
    try{
        const id = parseInt(params.id)
        const data = await request.json()

        const salidas = await obtenerSalidasDeGrupo(id)
        if(!salidas){
            return NextResponse.json({message:"Error al obtener las salidas."},{status:404})
        }
        return NextResponse.json(salidas)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}