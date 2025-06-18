import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button, Spinner, useDisclosure, Tooltip } from "@nextui-org/react";
import MainLayout from "@/aaaaaaa/Layout/MainLayout";
import RegistrarGasto from "@/aaaaaaa/Gastos/registrarGasto";
import ModificarGasto from "@/aaaaaaa/Gastos/modificarGasto";
import FiltroGastos from "./filtroGastos";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
} from "@nextui-org/react";
import { MdOutlinePayments } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

function ConsultaGastos() {
  const [gastos, setGastos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [totalGastos, setTotalGastos] = useState(0);
  const [gasto, setGasto] = useState(null);
  const [searchText, setSearchText] = useState("");

  //Variables para controlar el modal de registrar gasto
  const {
    onOpen: onRegistarOpen,
    isOpen: isRegistrarOpen,
    onOpenChange: onRegistarOpenChange,
  } = useDisclosure();

  //Variables para controlar el modal de ver detalles
  const {
    onOpen: onVerDetallesOpen,
    isOpen: isVerDetallesOpen,
    onOpenChange: onVerDetallesOpenChange,
  } = useDisclosure();

  //Variables para controlar el modal de modificar gasto
  const {
    onOpen: onModificarOpen,
    isOpen: isModificarOpen,
    onOpenChange: onModificarOpenChange,
  } = useDisclosure();

  //Traer la informacion de todos los gastos
  useEffect(() => {
    fetchGastos();
  }, []);

  const fetchGastos = async () => {
    try {
      const response = await axios.get("/api/gastos");
      if (response.status >= 200 && response.status < 300) {
        const gastosOrdenados = response.data.sort((a: any, b: any) => {
          const fechaA = new Date(a.fecha);
          const fechaB = new Date(b.fecha);
          return fechaB.getTime() - fechaA.getTime(); // Orden descendente
        });
        setGastos(gastosOrdenados);
        setTotalGastos(
          gastosOrdenados.reduce((acc: number, g: any) => acc + g.cantidad, 0)
        );
        setCargando(false);
      } else {
        throw new Error(response.data.message || "Error desconocido.");
      }
    } catch (e: any) {
      if (e.response.status === 404 || e.response.status === 500) {
        toast.error(e.response.data.message);
      } else {
        toast.error(e.message);
      }
    }
  };

  //Funcion para ver los detalles de un gasto
  const handleVerDetalles = (gasto: any) => {
    setGasto(gasto);
    onVerDetallesOpen();
  };

  //Funcion para editar un gasto
  function handleEditar(gasto: any) {
    setGasto(gasto);
    onModificarOpen();
  }

  const filteredGastos = gastos
    .filter((gasto) => {
      //@ts-ignore
      const concepto = gasto.concepto.toLowerCase();
      return concepto.includes(searchText.toLowerCase());
    })
    .sort((a, b) => {
      //@ts-ignore
      const conceptoA = a.concepto.toLowerCase();
      //@ts-ignore
      const conceptoB = b.concepto.toLowerCase();
      return conceptoA.localeCompare(conceptoB);
    });

  const formatFecha = (fecha: string) => {
    // Dividimos la fecha original en un array de año, mes y día
    const partesFecha = fecha.split("-");
    const año = partesFecha[0];
    const mes = partesFecha[1];
    const dia = partesFecha[2];

    // Reconstruimos la fecha en el formato deseado
    return `${dia}/${mes}/${año}`;
  };

  return (
    <MainLayout>
      <div className="flex flex-row m-4 md:px-10 md:pt-10 md:pb-4">
        <div className="flex flex-col md:flex-row">
          <h1 className="text-4xl font-bold">Gastos</h1>
          <FiltroGastos searchText={searchText} setSearchText={setSearchText} />
        </div>
        <div className=" ml-auto">
          <div className="flex flex-col md:flex-row items-center ">
            <Button
              className=" bg-verdeFuerte text-[#ffffff]"
              onPress={onRegistarOpen}
              startContent={<MdOutlinePayments />}
            >
              Registrar Gastos
            </Button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col m-4 md:px-10">
          {cargando ? (
            <div className="flex justify-center items-center">
              <Spinner size="lg" color="warning" />
            </div>
          ) : (
            <div className="flex w-full flex-col">
              <Card className="w-full">
                <CardBody>
                  <div className="p-2 flex flex-col w-full">
                    <div className="flex justify-between items-center py-4">
                      <h1 className="font-bold">
                        Total de gastos: ${totalGastos}
                      </h1>
                    </div>
                  </div>
                  <div className="overflow-y-auto max-h-[32rem]">
                    <Table aria-label="Example static collection table">
                      <TableHeader>
                        <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4">
                          Nombre del gasto
                        </TableColumn>
                        <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4">
                          Monto pagado
                        </TableColumn>
                        <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4">
                          Fecha del pago
                        </TableColumn>
                        <TableColumn className=" bg-headerNav text-[#ffffff] text-md w-1/4 ">
                          <div className="flex justify-center">Acciones</div>
                        </TableColumn>
                      </TableHeader>
                      <TableBody>
                        {filteredGastos.map((g: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>
                              <p className=" text-lg">{g.concepto}</p>
                            </TableCell>
                            <TableCell>
                              <p className=" text-lg">${g.cantidad}</p>
                            </TableCell>
                            <TableCell>
                              <p className=" text-lg">{formatFecha(g.fecha)}</p>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col md:flex-row justify-center items-center">
                                <Tooltip content="Editar">
                                  <Button
                                    isIconOnly
                                    size="md"
                                    className="bg-verdeDetails mx-0  my-2 md:mx-3 md:my-0"
                                    onClick={() => handleEditar(g)}
                                  >
                                    <FaRegEdit style={{ fontSize: "15px" }} />
                                  </Button>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
        <RegistrarGasto
          isOpen={isRegistrarOpen}
          onOpenChange={onRegistarOpenChange}
          fetchGastos={fetchGastos}
        />
        <ModificarGasto
          gasto={gasto}
          isOpen={isModificarOpen}
          onOpenChange={onModificarOpenChange}
          fetchGastos={fetchGastos}
        />
      </div>
    </MainLayout>
  );
}

export default ConsultaGastos;
