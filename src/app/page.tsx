"use client";

import { useState, useRef } from "react";
import Nav from "@/components/Nav";
import SemanaClientes from "@/components/SemanaClientes";
import Retrasos from "@/components/Retrasos";
import Vencidos from "@/components/Vencidos";
import AgregarCliente from "@/components/AgregarCliente";
import AgregarPrestamo from "@/components/AgregarPrestamo";
import CheckConnection from "@/components/CheckConnection";

export default function Home() {
  const [mostrarFormularios, setMostrarFormularios] = useState(false);

  // Crear referencia para los formularios
  const formularioRef = useRef<HTMLDivElement | null>(null);

  // Alternar visibilidad de los formularios y desplazarse
  const manejarClickRegistrar = () => {
    setMostrarFormularios(!mostrarFormularios);

    // Desplazar a los formularios si se muestran
    if (!mostrarFormularios && formularioRef.current) {
      formularioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      {/* Navbar */}
      <Nav onRegistrar={manejarClickRegistrar} />

      {/* Contenido principal */}
      <main className="p-8 m-8">
        <SemanaClientes />

        <h1 className="text-xl font-semibold mb-4 text-center text-gray-500 dark:text-gray-400">
          CLIENTES CON RETRASO
        </h1>

        {/* Contenedor para Retrasos y Vencidos */}
        <div className="flex flex-col lg:flex-row gap-8">
          <Retrasos />
          <Vencidos />
        </div>

        {/* Contenedor de formularios con referencia */}
        <div ref={formularioRef}>
          {mostrarFormularios && (
            <div className="flex flex-col lg:flex-row gap-4">
              <AgregarCliente />
              <AgregarPrestamo />
            </div>
          )}
        </div>

        <div>
          <CheckConnection />
        </div>
      </main>
    </div>
  );
}
