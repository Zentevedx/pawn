"use client";

import { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

interface Cliente {
  id: number;
  nombre: string;
}

export default function AgregarPrestamo() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState({
    codigo: "",
    monto: "",
    cliente: "",
    fecha: "",
    articulo_nombre: "",
    retraso: "0", // Valor predeterminado
  });
  const [clienteNombre, setClienteNombre] = useState<string>(""); // Estado para el nombre del cliente
  const [mensaje, setMensaje] = useState<string | null>(null);

  const { setClienteGuardado } = useGlobalContext(); // Accede al contexto global

  useEffect(() => {
    async function fetchClientes() {
      try {
        const res = await fetch("/api/clientes");
        if (!res.ok) throw new Error("Error al obtener clientes");
        const data = await res.json();
        setClientes(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchClientes();
  }, []);

  const handleFilterClientes = (query: string) => {
    if (query.trim() === "") {
      setFilteredClientes([]);
    } else {
      const results = clientes.filter((cliente) =>
        cliente.nombre.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredClientes(results);
    }
  };

  const handleSelectCliente = (cliente: Cliente) => {
    setForm({ ...form, cliente: cliente.id.toString() }); // Internamente usa el ID
    setClienteNombre(cliente.nombre); // Muestra el nombre en la interfaz
    setFilteredClientes([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje(null);

    try {
      const res = await fetch("/api/prestamos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error desconocido");
      }

      const data = await res.json();
      setMensaje(`Préstamo registrado con éxito: ${data.message}`);
      setForm({
        codigo: "",
        monto: "",
        cliente: "",
        fecha: "",
        articulo_nombre: "",
        retraso: "0",
      });
      setClienteNombre(""); // Limpia el nombre visible

      setClienteGuardado(true); // Notifica al contexto global
      setTimeout(() => setClienteGuardado(false), 1000); // Resetear estado
    } catch (error: any) {
      setMensaje(error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-md shadow-md w-full m-5">
      <h2 className="text-2xl font-bold mb-4 text-center">Registrar Préstamo y Artículo</h2>
      {mensaje && (
        <p className={`text-center mb-4 ${mensaje.includes("éxito") ? "text-green-400" : "text-red-400"}`}>
          {mensaje}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="codigo" className="block text-sm font-medium">
            Código:
          </label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            value={form.codigo}
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            required
            className="w-full px-3 py-2 rounded-md text-black"
          />
        </div>
        <div>
          <label htmlFor="monto" className="block text-sm font-medium">
            Monto:
          </label>
          <input
            type="number"
            id="monto"
            name="monto"
            value={form.monto}
            onChange={(e) => setForm({ ...form, monto: e.target.value })}
            required
            className="w-full px-3 py-2 rounded-md text-black"
          />
        </div>
        <div className="relative">
          <label htmlFor="cliente" className="block text-sm font-medium">
            Cliente:
          </label>
          <input
            type="text"
            id="cliente"
            name="cliente"
            value={clienteNombre} // Muestra el nombre en la interfaz
            onChange={(e) => {
              setClienteNombre(e.target.value); // Actualiza el nombre en la interfaz
              handleFilterClientes(e.target.value); // Filtra por nombre
            }}
            placeholder="Escribe para buscar un cliente"
            className="w-full px-3 py-2 rounded-md text-black"
          />
          {filteredClientes.length > 0 && (
            <ul className="absolute z-10 bg-white text-black w-full border rounded-md max-h-40 overflow-y-auto mt-1">
              {filteredClientes.map((cliente) => (
                <li
                  key={cliente.id}
                  onClick={() => handleSelectCliente(cliente)}
                  className="px-3 py-2 hover:bg-teal-500 hover:text-white cursor-pointer"
                >
                  {cliente.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label htmlFor="fecha" className="block text-sm font-medium">
            Fecha del Préstamo:
          </label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            required
            className="w-full px-3 py-2 rounded-md text-black"
          />
        </div>
        <div>
          <label htmlFor="articulo_nombre" className="block text-sm font-medium">
            Artículo:
          </label>
          <input
            type="text"
            id="articulo_nombre"
            name="articulo_nombre"
            value={form.articulo_nombre}
            onChange={(e) => setForm({ ...form, articulo_nombre: e.target.value })}
            required
            className="w-full px-3 py-2 rounded-md text-black"
          />
        </div>
        <div>
          <label htmlFor="retraso" className="block text-sm font-medium">
            Retraso (en días):
          </label>
          <input
            type="number"
            id="retraso"
            name="retraso"
            value={form.retraso}
            onChange={(e) => setForm({ ...form, retraso: e.target.value })}
            required
            className="w-full px-3 py-2 rounded-md text-black"
          />
        </div>
        <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 rounded-md">
          Guardar Préstamo
        </button>
      </form>
    </div>
  );
}
