import {NextRequest, NextResponse} from "next/server";
import {obtenerGrupos, registrarGrupo} from "@/Controllers/grupoController";

/**
 * Funcion GET para obtener grupos
 * @param request request http del usuario
 * @autor Jesus
 * @returns respuesta del servidor
 */
export async function GET(request:NextRequest) {
    try {
        const grupos = await obtenerGrupos()
        if (!grupos) {
            return NextResponse.json({message: "Error al obtener los grupos."}, {status: 404})
        }
        return NextResponse.json(grupos)
    } catch (e: any) {
        return NextResponse.json({message: e.message}, {status: 500})
    }
}

/**
 * Funcion POST para registrar un grupo
 * @param request request http del usuario
 * @autor Jesus
 * @returns respuesta del servidor
 */
export async function POST(request:NextRequest) {
    try {
        const grupo = await registrarGrupo(request.body)
        if (!grupo) {
            return NextResponse.json({message: "Error al registrar el grupo."}, {status: 404})
        }
        return NextResponse.json(grupo, {status: 201})
    } catch (e: any) {
        return NextResponse.json({message: e.message}, {status: 500})
    }
}