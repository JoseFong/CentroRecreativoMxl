import React from "react";
import MainLayout from "@/components/Layout/MainLayout";
import Image from "next/image";
import Construction from "@/Assets/icons8-road-construction-100.png";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

function page() {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get("centroDeAtencionMultipleUser");
    if (!cookie) redirect("/");
    const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
    if (!decoded) redirect("/");
  } catch (e: any) {
    redirect("/");
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-[500px] w-full items-center justify-center">
        <Image src={Construction} alt="En construcción." />
        <p>Esta página está en construcción. !Gracias por su paciencia!</p>
      </div>
    </MainLayout>
  );
}

export default page;
