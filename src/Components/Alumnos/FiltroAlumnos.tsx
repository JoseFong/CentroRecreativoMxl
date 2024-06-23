import React from "react";
import { Input } from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";

const FiltroAlumnos = ({ searchText, setSearchText }: any) => {
  return (
    <div className="flex flex-row ">
      <Input
        className="ml-0 mt-4 md:ml-8 md:mt-0"
        variant="bordered"
        placeholder="Buscar nombre de alumno"
        startContent={<CiSearch />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
};

export default FiltroAlumnos;
