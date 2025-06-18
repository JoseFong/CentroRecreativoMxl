"use client";
import React, { ReactNode, FC } from "react";
import NavBar from "./NavBar";

interface Props {
  children: ReactNode;
}

const MainLayout: FC<Props> = ({ children }) => {
  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
};

export default MainLayout;
