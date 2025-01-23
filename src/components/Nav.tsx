"use client";

import { useState } from "react";

export default function Nav({ onRegistrar }: { onRegistrar: () => void }) {
  const [busqueda, setBusqueda] = useState("");

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
  };

  return (
    <nav className="bg-teal-500 dark:bg-teal-700 text-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
      {/* Título */}
      <h1 className="text-2xl font-bold font-title">ZENTEVED - LU</h1>

      {/* Barra de búsqueda */}
      <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-sm w-full sm:w-auto">
        <input
          type="text"
          value={busqueda}
          onChange={manejarCambio}
          placeholder="Buscar..."
          className="px-4 py-2 w-full sm:w-64 text-gray-700 font-body focus:outline-none"
        />
        <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2">🔍</button>
      </div>

      {/* Botón de registrar */}
      <button
        onClick={onRegistrar}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 font-body"
      >
        Registrar
      </button>
    </nav>
  );
}
