import { NextResponse } from "next/server";
import {
  actualizarDocente,
  eliminarDocente,
} from "@/Controllers/docenteController";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export async function PUT(request: Request, { params }: Params) {
  const { id } = params;
  const body = await request.json();
  const docenteActualizado = await actualizarDocente(id, body);
  return NextResponse.json(docenteActualizado);
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = params;
  await eliminarDocente(id);
  return NextResponse.json({ message: "Docente eliminado" });
}
