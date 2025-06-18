import { NextResponse } from "next/server";
import {
  crearDocente,
  obtenerTodosDocentes,
} from "@/Controllers/docenteController";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

export async function GET() {
  try {
const cookieStore = cookies();
            const cookie = cookieStore.get("centroDeAtencionMultipleUser");
            if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
            const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
            if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

    const docentes = await obtenerTodosDocentes();
    return NextResponse.json(docentes);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  try {
const cookieStore = cookies();
            const cookie = cookieStore.get("centroDeAtencionMultipleUser");
            if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
            const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
            if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

    const body = await request.json();
    const nuevoDocente = await crearDocente(body);
    console.log(body);
    return NextResponse.json(nuevoDocente);
  } catch (error) {
    console.error("Error al crear el docente:", error);
    return NextResponse.error();
  }
}
