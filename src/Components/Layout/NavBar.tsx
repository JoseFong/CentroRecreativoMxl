import React, { useState } from "react";
import { Button, Tooltip } from "@nextui-org/react";
import { IoLogOutOutline } from "react-icons/io5";
import Image from "next/image";
import Logo from "../../Assets/Logo.png";
import Link from "next/link";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [opciones, setOpciones] = useState([
    { nombre: "Alumnos", path: "/alumnos" },
    { nombre: "Docentes", path: "/docentes" },
    { nombre: "Pagos", path: "/pagos" },
    { nombre: "Gastos", path: "/gastos" },
    { nombre: "Documentos", path: "/documentos" },
    { nombre: "Grupos", path: "/grupos" },
    { nombre: "Actividades", path: "/actividades" },
  ]);

  return (
    <header>
      <nav
        x-data="{ open: false }"
        className="flex h-auto w-auto  bg-headerNav shadow-lg justify-between md:h-20"
      >
        <div className="flex w-full justify-between ">
          <div
            className={`flex px-6 w-1/2 items-center font-semibold md:w-1/5 md:px-1 md:flex md:items-center md:justify-center ${
              isMenuOpen ? "hidden" : "flex"
            }`}
          >
            <Image src={Logo} alt="Logo" className="w-24 h-20 p-2" />
          </div>

          <div
            className={`flex flex-col w-full h-auto md:hidden ${
              isMenuOpen ? "flex" : "hidden"
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              {opciones.map((opc, index) => (
                <Link href={opc.path} key={index}>
                  <Button
                    key={index}
                    color="success"
                    variant="light"
                    size="lg"
                    className="text-[#ffffff]"
                  >
                    {opc.nombre}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden w-2/4 items-center justify-evenly font-semibold md:flex">
            {opciones.map((opc, index) => (
              <Link href={opc.path} key={index}>
                <Button
                  key={index}
                  color="success"
                  variant="light"
                  size="lg"
                  className="text-[#ffffff]"
                >
                  {opc.nombre}
                </Button>
              </Link>
            ))}
          </div>
          <div className="hidden w-1/5 items-center justify-evenly font-semibold md:flex">
            <Tooltip content="Cerrar sesión">
              <Button
                className=" bg-verdeFuerte text-[#ffffff]"
                variant="solid"
                isIconOnly
                size="lg"
              >
                <IoLogOutOutline style={{ fontSize: "22px" }} />
              </Button>
            </Tooltip>
          </div>
          <button
            className="text-white w-10 h-10 relative focus:outline-none bg-headerNav md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span
                aria-hidden="true"
                className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
                  isMenuOpen ? "rotate-45" : "-translate-y-1.5"
                }`}
              ></span>
              <span
                aria-hidden="true"
                className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                aria-hidden="true"
                className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
                  isMenuOpen ? "-rotate-45" : "translate-y-1.5"
                }`}
              ></span>
            </div>
          </button>
        </div>
      </nav>
    </header>
  );
}
