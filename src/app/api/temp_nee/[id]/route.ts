import { eliminarNEE, actualizarNEE } from "@/Controllers/nee/neurodivergenciaController";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    id: string
}

/**
 * Maneja la solicitud DELETE para eliminar una neurodivergencia existente.
 * @author Daniela
 * @param request - Solicitud Next.js.
 * @param params - Parámetros de la solicitud que incluyen el ID de la neurodivergencia a eliminar.
 * @returns Neurodivergencia eliminada o un mensaje de error.
 */
export async function DELETE(request:NextRequest, {params}:{params:Params}) {
    try {
        const idNum: number = parseInt(params.id)
        const neurodivergencia = await eliminarNEE(idNum)
        if(!neurodivergencia) {
            return NextResponse.json({message: "Hubo un error al eliminar"})
        }
        return NextResponse.json(neurodivergencia)
    } catch (e: any) {
        return NextResponse.json({message: e.message}, {status: 500})
    }
}

/**
 * Maneja la solicitud PUT para modificar una neurodivergencia existente.
 * @author Daniela
 * @param request - Solicitud Next.js.
 * @param params - Parámetros de la solicitud que incluyen el ID de la neurodivergencia a actualizar.
 * @returns Neurodivergencia actualizada o un mensaje de error.
 */
export async function PUT(request: NextRequest, {params}:{params: {id: string}}) {
    try {
        const idNum: number = parseInt(params.id)
        if(isNaN(idNum)) {
            return NextResponse.json({message: "ID invalido"}, {status: 400})
        }
    
    const data = await request.json();
    const {nombre} = data;
    if(!nombre){
        return NextResponse.json({ message: "Nombre es requerido" }, { status: 400 });
    }

    const neurodivergencia = await actualizarNEE(idNum, { nombre });
        if (!neurodivergencia) {
        return NextResponse.json({ message: "Hubo un error al actualizar" }, { status: 404 });
        }
        return NextResponse.json(neurodivergencia, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}

