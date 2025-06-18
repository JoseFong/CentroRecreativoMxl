import { NextResponse } from "next/server";
import {
  actualizarDocente,
  eliminarDocente,
} from "@/Controllers/docenteController";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

export async function PUT(request: Request, { params }: Params) {
const cookieStore = cookies();
            const cookie = cookieStore.get("centroDeAtencionMultipleUser");
            if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
            const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
            if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

  const { id } = params;
  const body = await request.json();
  const docenteActualizado = await actualizarDocente(id, body);
  return NextResponse.json(docenteActualizado);
}

export async function DELETE(request: Request, { params }: Params) {
const cookieStore = cookies();
            const cookie = cookieStore.get("centroDeAtencionMultipleUser");
            if (!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
            const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
            if (!decoded) return NextResponse.json({message:"No está autorizado."},{status:400})

  const { id } = params;
  await eliminarDocente(id);
  return NextResponse.json({ message: "Docente eliminado" });
}
