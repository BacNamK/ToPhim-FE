import { createContext } from "react";
import { Outlet } from "react-router";
import Navbar from "../components/navbar";

export const BgGlobal = createContext(true);

function BgProvider() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default BgProvider;
