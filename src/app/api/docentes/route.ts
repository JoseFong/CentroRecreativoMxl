import { NextResponse } from "next/server";
import {
  crearDocente,
  obtenerTodosDocentes,
} from "@/Controllers/docenteController";

export async function GET() {
  try {
    const docentes = await obtenerTodosDocentes();
    return NextResponse.json(docentes);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nuevoDocente = await crearDocente(body);
    console.log(body);
    return NextResponse.json(nuevoDocente);
  } catch (error) {
    console.error("Error al crear el docente:", error);
    return NextResponse.error();
  }
}
