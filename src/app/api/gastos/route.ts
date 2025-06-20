import { obtenerGastos, registrarGasto } from "@/Controllers/gastoController";
import { NextRequest, NextResponse } from "next/server";
import { eliminarGastosDeOtroMes } from "@/Controllers/gastoController";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

/**
 * Función GET para gastos
 * @param request request http del usuario
 * @autor Jesus
 * @returns respuesta del servidor
 */
export async function GET(request: NextRequest) {
  try {
const cookieStore = cookies();
            const cookie = cookieStore.get("centroDeAtencionMultipleUser");
            if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
            const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
            if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

    const gastos = await obtenerGastos();
    if (!gastos) {
      return NextResponse.json(
        { message: "Error al obtener los gastos." },
        { status: 404 }
      );
    }
    return NextResponse.json(gastos);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

/**
 * Función POST para registrar un gasto
 * @param request
 * @autor Jesus
 * @returns mensaje de confirmación o de error
 */
export async function POST(request: NextRequest) {
  try {
const cookieStore = cookies();
            const cookie = cookieStore.get("centroDeAtencionMultipleUser");
            if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
            const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
            if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

    const data = await request.json();
    const response = await registrarGasto(data);
    if (response !== "registrado") {
      return NextResponse.json({ message: response }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Gasto registrado exitosamente." },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
