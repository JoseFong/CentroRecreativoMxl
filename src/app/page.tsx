"use client";
import MainLayout from "../aaaaaaa/Layout/MainLayout";

import { Image } from "@nextui-org/image";

export default function Home() {
  const fecha = new Date();
  const hora = fecha.getHours();

  const Saludo = (hora: number): string => {
    if (hora >= 0 && hora < 12) {
      return "Buenos días!";
    } else if (hora >= 12 && hora < 19) {
      return "Buenas tardes!";
    } else if (hora >= 19 && hora <= 23) {
      return "Buenas noches!";
    } else {
      return "Hola!";
    }
  };

  return (
    <MainLayout>
      <div className="w-full h-screen  ">
        <div className=" flex w-full h-full ">
          <div className="grid md:grid-cols-2 grid-cols-1 w-full mb-20">
            <div className=" w-full flex justify-center items-center flex-col md:p-5 ">
              <div className="bg-verdeFuerte rounded-xl py-10 md:mt-0 mt-5">
                <span className=" font-bold text-4xl md:px-14 text-[#ffffff] flex md:block justify-center">
                  {Saludo(hora)}
                </span>
                <div className="md:px-14 md:py-14 p-2">
                  <span className="text-[#ffffff] md:text-lg text-md text-justify">
                    En CAM, nos dedicamos a proporcionar una educación inclusiva
                    y de calidad a adultos mayores que enfrentan algún tipo de
                    discapacidad mental. Nuestro compromiso es crear un ambiente
                    de aprendizaje seguro y acogedor donde cada estudiante pueda
                    desarrollarse a su propio ritmo y potenciar sus habilidades.
                    Creemos firmemente en el poder transformador de la educación
                    y trabajamos incansablemente para adaptar nuestras
                    metodologías a las necesidades únicas de nuestros alumnos. A
                    través de un enfoque personalizado, promovemos la
                    independencia, la confianza y la participación activa en la
                    comunidad.
                  </span>
                </div>
                <div className="md:px-14 md:py-14 p-2">
                  <span className="text-[#ffffff] md:text-lg text-md text-justify">
                    Nuestro equipo de profesionales está capacitado y
                    comprometido a brindar el apoyo necesario para que cada
                    estudiante alcance su máximo potencial. En CAM, no solo
                    enseñamos, sino que también aprendemos y crecemos juntos,
                    celebrando cada logro y superando cada desafío.
                  </span>
                </div>
              </div>
            </div>
            <div className="md:p-4 w-full flex justify-center items-center flex-col ">
              <Image
                width={1000}
                alt="NextUI hero Image"
                src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
