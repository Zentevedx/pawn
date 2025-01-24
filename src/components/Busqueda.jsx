"use client";

import React, { useState } from "react";
import CardPrestamo from "@/components/CardPrestamo";

const Busqueda = () => {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!query.trim()) {
      setError("Por favor, ingresa un criterio de búsqueda.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/busqueda?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`Error: ${res.status} - ${res.statusText}`);

      const data = await res.json();
      setResultados(data);
    } catch (err) {
      console.error("Error al realizar la búsqueda:", err);
      setError("Hubo un error al realizar la búsqueda. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-md shadow-md w-full m-5">
      {/* Título */}
      <h1 className="text-2xl text-orange font-bold text-center mb-4">Búsqueda de Clientes y Préstamos</h1>

      {/* Formulario */}
      <form onSubmit={handleSearch} className="flex flex-col w-full max-w-4xl gap-4 mb-6">
        <input
          type="text"
          placeholder="Ingresa Carnet, Código de Préstamo o Nombre del Cliente"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded text-black"
        />
        <button
          type="submit"
          className="bg-green-500 py-2 px-4 rounded hover:bg-gray-600"
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {/* Mensaje de Error */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Resultados */}
      <div
        className={`grid gap-5 h-full max-w-8xl ${
          resultados.length === 1
            ? "grid-cols-1"
            : resultados.length === 2
            ? "grid-cols-2"
            : "grid-cols-4"
        }`}
      >
        {resultados.map((prestamo, index) => (
          <CardPrestamo key={index} prestamo={prestamo} />
        ))}
      </div>

      {/* Mensaje cuando no hay resultados */}
      {resultados.length === 0 && !loading && !error && (
        <p className="text-gray-500 mt-4">No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default Busqueda;
