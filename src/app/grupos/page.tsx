import React from "react";
import ConsultaGrupos from "@/components/Grupos/consulta";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

function Grupos() {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get("centroDeAtencionMultipleUser");
    if (!cookie) redirect("/");
    const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
    if (!decoded) redirect("/");
  } catch (e: any) {
    redirect("/");
  }

  return <ConsultaGrupos />;
}

export default Grupos;
