"use client";

import { useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

export default function AgregarCliente() {
  const [form, setForm] = useState({ nombre: "", carnet: "", celular: "" });
  const [mensaje, setMensaje] = useState<string | null>(null);
  const { setClienteGuardado } = useGlobalContext(); // Acceder al estado global

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje(null);

    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Error desconocido");
      }

      const data = await res.json();
      setMensaje(`Cliente ${data.nombre} (ID: ${data.id}) agregado con éxito`);
      setForm({ nombre: "", carnet: "", celular: "" }); // Limpiar formulario

      setClienteGuardado(true); // Actualizar estado global
      setTimeout(() => setClienteGuardado(false), 1000); // Resetear estado
    } catch (error: any) {
      setMensaje(error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-md shadow-md w-full m-5">
      <h2 className="text-2xl font-bold mb-4 text-center">Agregar Cliente</h2>
      {mensaje && (
        <p className={`text-center mb-4 ${mensaje.includes("éxito") ? "text-green-400" : "text-red-400"}`}>
          {mensaje}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-md text-black focus:outline-none focus:ring focus:ring-teal-500"
          />
        </div>
        <div>
          <label htmlFor="carnet" className="block text-sm font-medium">Carnet:</label>
          <input
            type="text"
            id="carnet"
            name="carnet"
            value={form.carnet}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-md text-black focus:outline-none focus:ring focus:ring-teal-500"
          />
        </div>
        <div>
          <label htmlFor="celular" className="block text-sm font-medium">Celular:</label>
          <input
            type="text"
            id="celular"
            name="celular"
            value={form.celular}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-md text-black focus:outline-none focus:ring focus:ring-teal-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 rounded-md transition"
        >
          Guardar Cliente
        </button>
      </form>
    </div>
  );
}
