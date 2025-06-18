"use client";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const fecha = new Date();
  const hora = fecha.getHours();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const router = useRouter();

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

  async function login() {
    try {
      setLoading(true);
      if (username.trim() === "" || password.trim() === "")
        throw new Error("Complete todos los campos.");

      const data = {
        username: username.trim(),
        password: password.trim(),
      };

      const res = await axios.post("/api/login", data);

      router.push("/alumnos");

      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-screen flex-row gap-5 p-8">
      <div className="bg-verdeFuerte rounded-xl py-10 md:mt-0 mt-5 z-50 w-2/3">
        <span className=" font-bold text-4xl md:px-14 text-[#ffffff] flex md:block justify-center">
          {Saludo(hora)}
        </span>
        <div className="md:px-14 md:py-14 p-2">
          <span className="text-[#ffffff] md:text-lg text-md text-justify">
            En CAM, nos dedicamos a proporcionar una educación inclusiva y de
            calidad a adultos mayores que enfrentan algún tipo de discapacidad
            mental. Nuestro compromiso es crear un ambiente de aprendizaje
            seguro y acogedor donde cada estudiante pueda desarrollarse a su
            propio ritmo y potenciar sus habilidades. Creemos firmemente en el
            poder transformador de la educación y trabajamos incansablemente
            para adaptar nuestras metodologías a las necesidades únicas de
            nuestros alumnos. A través de un enfoque personalizado, promovemos
            la independencia, la confianza y la participación activa en la
            comunidad.
          </span>
        </div>
        <div className="md:px-14 md:py-14 p-2">
          <span className="text-[#ffffff] md:text-lg text-md text-justify">
            Nuestro equipo de profesionales está capacitado y comprometido a
            brindar el apoyo necesario para que cada estudiante alcance su
            máximo potencial. En CAM, no solo enseñamos, sino que también
            aprendemos y crecemos juntos, celebrando cada logro y superando cada
            desafío.
          </span>
        </div>
      </div>
      <div className="w-1/3 flex items-center justify-center text-lg">
        <div className="border-2 rounded-lg shadow-md p-5 flex flex-col">
          <h1 className="font-bold text-xl mb-3">Iniciar sesión</h1>
          <label>Usuario</label>
          <input
            className="p-1 bg-zinc-100 rounded-lg"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Contraseña</label>
          {seePassword ? (
            <input
              className="p-1 bg-zinc-100 rounded-lg"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          ) : (
            <input
              type="password"
              className="p-1 bg-zinc-100 rounded-lg"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          <div className="flex flex-row gap-2 mt-2">
            <label>Mostrar contraseña</label>
            <input
              type="checkbox"
              checked={seePassword}
              onChange={() => setSeePassword(!seePassword)}
            />
          </div>
          <Button
            onPress={login}
            className=" bg-verdeFuerte text-[#ffffff] mt-2"
            isDisabled={loading}
          >
            {loading ? "Cargando..." : "Iniciar sesión"}
          </Button>
        </div>
      </div>
    </div>
  );
}
