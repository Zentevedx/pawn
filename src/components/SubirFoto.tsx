"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Prestamo {
  codigo: string;
  articulo_id: number;
}

export default function SubirFoto() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [articuloId, setArticuloId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrestamos() {
      try {
        const res = await axios.get("/api/prestamos");
        setPrestamos(res.data);
      } catch (error) {
        console.error("Error al obtener préstamos:", error);
      }
    }

    fetchPrestamos();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje(null);

    if (!file || !articuloId) {
      setMensaje("Selecciona un archivo y un código de préstamo");
      return;
    }

    const formData = new FormData();
    formData.append("articulo_id", articuloId.toString());
    formData.append("file", file);

    try {
      const res = await axios.post("/api/fotos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMensaje(`Foto subida con éxito: ${res.data.message}`);
      setFile(null);
      setArticuloId(null);
    } catch (error: any) {
      console.error("Error al subir la foto:", error);
      setMensaje(error.response?.data?.error || "Error desconocido");
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-md shadow-md w-full m-5">
      <h2 className="text-2xl font-bold mb-4 text-center">Subir Foto del Artículo</h2>
      {mensaje && (
        <p className={`text-center mb-4 ${mensaje.includes("éxito") ? "text-green-400" : "text-red-400"}`}>
          {mensaje}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="articulo_id" className="block text-sm font-medium">
            Código del Préstamo:
          </label>
          <select
            id="articulo_id"
            name="articulo_id"
            value={articuloId || ""}
            onChange={(e) => setArticuloId(Number(e.target.value))}
            required
            className="w-full px-3 py-2 rounded-md text-black"
          >
            <option value="">Selecciona un código</option>
            {prestamos.map((prestamo) => (
              <option key={prestamo.codigo} value={prestamo.articulo_id}>
                {prestamo.codigo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="file" className="block text-sm font-medium">
            Imagen del Artículo:
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            required
            accept="image/*"
            className="w-full px-3 py-2 rounded-md text-black"
          />
        </div>
        <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 rounded-md">
          Subir Foto
        </button>
      </form>
    </div>
  );
}
