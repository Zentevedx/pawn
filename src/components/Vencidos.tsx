"use client";

export default function Vencidos() {
  const datosVencidos = [
    { codigo: "A302", nombre: "Amoladora Bosch", imagen: "/amoladora.png" },
    { codigo: "A302", nombre: "Cortadora de Carne", imagen: "/cortadora.png" },
  ];

  return (
    <div className="bg-gray-700 p-4 rounded-md shadow-md w-full">
      <h2 className="text-xl font-bold mb-4 text-center text-white">VENCIDOS</h2>
      <div className="flex flex-wrap gap-4 justify-center">
        {datosVencidos.map((vencido, index) => (
          <div
            key={index}
            className="bg-gray-600 p-4 rounded-md text-center w-60 shadow-lg"
          >
            <h3 className="text-lg font-bold text-white mb-2">{vencido.codigo}</h3>
            <img
              src={vencido.imagen}
              alt={vencido.nombre}
              className="h-32 mx-auto mb-4 object-contain"
            />
            <p className="text-sm text-gray-300">{vencido.nombre}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
