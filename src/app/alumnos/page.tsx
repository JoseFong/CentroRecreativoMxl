import React from "react";
import ConsultaAlumnos from "../../components/Alumnos/consulta";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

function Alumnos() {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get("centroDeAtencionMultipleUser");
    if (!cookie) redirect("/");
    const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
    if (!decoded) redirect("/");
  } catch (e: any) {
    redirect("/");
  }

  return <ConsultaAlumnos />;
}

export default Alumnos;
