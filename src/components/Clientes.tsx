"use client";

import { useEffect, useState } from "react";

interface Cliente {
  id: number;
  nombre: string;
  carnet: string;
  celular: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClientes() {
      try {
        const res = await fetch("/api/clientes");
        const contentType = res.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            `Respuesta no válida: ${await res.text()}`
          );
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.details || "Error desconocido");
        }

        const data = await res.json();
        setClientes(data);
      } catch (error: any) {
        setError(error.message);
      }
    }

    fetchClientes();
  }, []);

  return (
    <div className="p-4 rounded-md shadow-md w-full m-5 bg-gray-800" >
      <h2 className="text-2xl font-bold mb-4 text-center text-white">Lista de Clientes</h2>
      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <ul className="space-y-2">
          {clientes.map((cliente) => (
            <li key={cliente.id} className="bg-gray-100 p-2 rounded shadow">
              <p>
                <strong>Nombre:</strong> {cliente.nombre}
              </p>
              <p>
                <strong>Carnet:</strong> {cliente.carnet}
              </p>
              <p>
                <strong>Celular:</strong> {cliente.celular}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
