"use client";

import { useEffect, useState } from "react";

export default function CheckConnection() {
  const [status, setStatus] = useState<"success" | "error" | "loading">(
    "loading"
  );

  useEffect(() => {
    async function checkConnection() {
      try {
        const res = await fetch("/api/health");
        if (res.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
      }
    }

    checkConnection();
  }, []);

  return (
    <div className="p-4">
      {status === "loading" && <p>Comprobando conexión...</p>}
      {status === "success" && (
        <p className="text-green-500">Conexión exitosa con la base de datos</p>
      )}
      {status === "error" && (
        <p className="text-red-500">Error en la conexión con la base de datos</p>
      )}
    </div>
  );
}
