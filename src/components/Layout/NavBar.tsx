import React, { useState } from "react";
import { Button, Tooltip } from "@nextui-org/react";
import { IoLogOutOutline } from "react-icons/io5";
import Image from "next/image";
import Logo from "../../Assets/Logo.png";
import Link from "next/link";
import Logout from "@/Assets/icons8-logout-90.png";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [opciones] = useState([
    { nombre: "Alumnos", path: "/alumnos" },
    { nombre: "Docentes", path: "/docentes" },
    { nombre: "Pagos", path: "/pagos" },
    { nombre: "Gastos", path: "/gastos" },
    { nombre: "Documentos", path: "/documentos" },
    { nombre: "Grupos", path: "/grupos" },
    { nombre: "Actividades", path: "/actividades" },
  ]);

  const router = useRouter();

  async function logout() {
    try {
      const res = await axios.get("/api/login");
      router.push("/");
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return (
    <header className="bg-headerNav shadow-lg relative">
      <nav className=" mx-auto px-4">
        <div className="flex justify-center	items-center h-20">
          <div className="flex items-center">
            <Link href={"/"}>
              <Image
                src={Logo}
                alt="Logo"
                width={96}
                height={80}
                className="p-2"
              />
            </Link>
          </div>

          <div className="hidden md:flex space-x-4">
            {opciones.map((opc, index) => (
              <Link href={opc.path} key={index}>
                <Button
                  color="success"
                  variant="light"
                  size="md"
                  className="text-white"
                >
                  {opc.nombre}
                </Button>
              </Link>
            ))}
            <Button
              color="success"
              variant="light"
              size="md"
              className="text-white"
              isIconOnly
              onPress={logout}
            >
              <Image src={Logout} alt="Cerrar sesión" />
            </Button>
          </div>

          <div className="md:hidden flex items-center flex-row gap-3">
            <button
              className="text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <Button
              color="success"
              variant="light"
              size="md"
              className="text-white"
              isIconOnly
              onPress={logout}
            >
              <Image src={Logout} alt="Cerrar sesión" />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {opciones.map((opc, index) => (
                <Link href={opc.path} key={index}>
                  <Button
                    color="success"
                    variant="light"
                    size="sm"
                    className="text-white w-full justify-start"
                  >
                    {opc.nombre}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
