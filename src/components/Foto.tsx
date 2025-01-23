"use client";

import { useState } from "react";

export default function SubirImagen() {
  const [file, setFile] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje(null);

    if (!file) {
      setMensaje("Selecciona un archivo primero.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error desconocido");
      }

      const data = await res.json();
      setMensaje(`Archivo subido con éxito: ${data.fileName}`);
      setFile(null);
    } catch (error: any) {
      console.error("Error al subir el archivo:", error.message);
      setMensaje(error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Subir Imagen</h2>
      {mensaje && (
        <p className={`text-center mb-4 ${mensaje.includes("éxito") ? "text-green-400" : "text-red-400"}`}>
          {mensaje}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="file" className="block text-sm font-medium">
            Selecciona una imagen:
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
        <button
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 rounded-md transition"
        >
          Subir Imagen
        </button>
      </form>
    </div>
  );
}
