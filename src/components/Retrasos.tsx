"use client";

export default function Retrasos() {
  const datosRetrasos = [
    { codigo: "A302", fecha: "12/04/2024", progreso: 85, monto: "Bs.- 1500" },
    { codigo: "A302", fecha: "12/04/2024", progreso: 50, monto: "Bs.- 1500" },
    { codigo: "A302", fecha: "12/04/2024", progreso: 25, monto: "Bs.- 1500" },
  ];

  return (
    <div className="bg-gray-700 p-4 rounded-md shadow-md w-full">
      <h2 className="text-xl font-bold mb-4 text-center text-white">RETRASOS</h2>
      <div className="flex flex-wrap gap-4 justify-center">
        {datosRetrasos.map((retraso, index) => (
          <div
            key={index}
            className="bg-gray-600 p-4 rounded-md text-center w-60 shadow-lg"
          >
            <h3 className="text-lg font-bold text-white">{retraso.codigo}</h3>
            <p className="text-sm text-gray-300">FECHA: {retraso.fecha}</p>
            <div className="mt-2 bg-gray-500 h-4 rounded overflow-hidden">
              <div
                className="bg-teal-400 h-full"
                style={{ width: `${retraso.progreso}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-300">MONTO: {retraso.monto}</p>
            <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
              DETALLES
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
