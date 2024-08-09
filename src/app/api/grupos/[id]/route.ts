import { actualizarGrupo, eliminarGrupo } from "@/Controllers/grupoController";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    id: string;
}

/**
 * Función handler para actualizar un grupo
 * @autor Jesus
 * @param request request del user
 * @returns el grupo actualizado
 * @returns error si no se pudo actualizar el grupo
 */
export async function PATCH(request:NextRequest) {
    try {
        const data = await request.json()
        const response = await actualizarGrupo(data)
        if (!response) {
            return NextResponse.json({message: "Error al actualizar el grupo."}, {status: 404})
        }

        if (response === "Ya existe otro grupo con ese nombre") {
            return NextResponse.json({message: "Ya existe otro grupo con ese nombre."}, {status: 400})
        }

        return NextResponse.json(response)
    } catch (e: any) {
        return NextResponse.json({message: e.message}, {status: 500})
    }
}

export async function DELETE(request:NextRequest, {params}:{params:Params}) {
    try {
        const id = parseInt(params.id);
        const response = await eliminarGrupo(id);
        if (!response) {
            return NextResponse.json({ message: "Error al eliminar el grupo." }, { status: 404 });
        }
        return NextResponse.json(response);
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}