import { obtenerTodasNEE, registrarNEE } from "@/Controllers/NEE/neurodivergenciaController";
import { NextRequest, NextResponse } from "next/server";

/**
 * Maneja la solicitud GET para obtener todas las neurodivergencias.
 * @author Daniela
 * @param request - Solicitud Next.js.
 * @returns Lista de neurodivergencias o un mensaje de error.
 */
export async function GET(request: NextRequest) {
  try {
    const neurodivergencias = await obtenerTodasNEE();
    if (!neurodivergencias) {
      return NextResponse.json({ message: "Error al obtener las neurodivergencias." }, { status: 404 });
    }
    return NextResponse.json(neurodivergencias);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

/**
 * Maneja la solicitud POST para registrar una nueva neurodivergencia.
 * @author Daniela
 * @param request - Solicitud Next.js.
 * @returns Neurodivergencia registrada o un mensaje de error.
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const neurodivergencia = await registrarNEE(data);
    if (!neurodivergencia) {
      return NextResponse.json({ message: "Hubo un error al registrar la neurodivergencia." }, { status: 404 });
    }
    if (neurodivergencia === "Neurodivergencia_repetida") {
      return NextResponse.json({ message: "Neurodivergencia repetida." }, { status: 400 });
    }
    return NextResponse.json(neurodivergencia, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
