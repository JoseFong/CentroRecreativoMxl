import React, { useState } from "react";
import { Button, Tooltip } from "@nextui-org/react";
import { IoLogOutOutline } from "react-icons/io5";
import Image from "next/image";
import Logo from "../../Assets/Logo.png";
import Link from "next/link";

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

  return (
    <header className="bg-headerNav shadow-lg">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Image
              src={Logo}
              alt="Logo"
              width={96}
              height={80}
              className="p-2"
            />
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
          </div>

          <div className="hidden md:flex items-center">
            <Tooltip content="Cerrar sesión">
              <Button
                className="bg-verdeFuerte text-white"
                variant="solid"
                isIconOnly
                size="lg"
              >
                <IoLogOutOutline style={{ fontSize: "22px" }} />
              </Button>
            </Tooltip>
          </div>

          <div className="md:hidden">
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
            <div className="pt-4 pb-3 border-t border-gray-700">
              <Tooltip content="Cerrar sesión">
                <Button
                  className="bg-verdeFuerte text-white w-full"
                  variant="solid"
                  size="lg"
                >
                  <IoLogOutOutline
                    style={{ fontSize: "22px" }}
                    className="mr-2"
                  />
                  Cerrar sesión
                </Button>
              </Tooltip>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
