"use client";

import { useEffect, useState } from "react";

interface Prestamo {
  codigo: string;
  monto: string;
  fechaPrestamo: string; // Fecha del préstamo en formato ISO
  fechaRenovacion?: string; // Fecha de renovación (opcional, en formato ISO)
}

export default function SemanaClientes() {
  const [dias, setDias] = useState<string[]>([]); // Fechas dinámicas de la semana
  const [mes, setMes] = useState<string>(""); // Mes actual
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]); // Préstamos filtrados por semana

  useEffect(() => {
    const obtenerDiasYMes = () => {
      const nombresDias = [
        "DOMINGO",
        "LUNES",
        "MARTES",
        "MIERCOLES",
        "JUEVES",
        "VIERNES",
        "SABADO",
      ];
      const nombresMeses = [
        "ENERO",
        "FEBRERO",
        "MARZO",
        "ABRIL",
        "MAYO",
        "JUNIO",
        "JULIO",
        "AGOSTO",
        "SEPTIEMBRE",
        "OCTUBRE",
        "NOVIEMBRE",
        "DICIEMBRE",
      ];
      const hoy = new Date();

      // Obtener el mes actual
      setMes(nombresMeses[hoy.getMonth()]);

      // Generar los próximos 7 días dinámicos
      const diasOrdenados = [];
      for (let i = 0; i < 7; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() + i);
        const dia = `${nombresDias[fecha.getDay()]} ${fecha.getDate()}`;
        diasOrdenados.push({
          diaCompleto: dia,
          diaMes: fecha.getDate(),
          mes: fecha.getMonth(),
        });
      }
      return diasOrdenados;
    };

    setDias(obtenerDiasYMes());
  }, []);

  useEffect(() => {
    const obtenerPrestamos = async () => {
      try {
        const res = await fetch("/api/prestamos");
        if (!res.ok) throw new Error("Error al obtener préstamos");
        const data = await res.json();
        const prestamosFiltrados = filtrarPrestamos(data); // Filtrar préstamos según la semana dinámica
        setPrestamos(prestamosFiltrados);
      } catch (error) {
        console.error(error);
      }
    };

    obtenerPrestamos();
  }, [dias]);
  

  const filtrarPrestamos = (prestamos: Prestamo[]): Prestamo[] => {
    const prestamosFiltrados: Prestamo[] = [];
    const hoy = new Date();

    dias.forEach((diaSemana) => {
      prestamos.forEach((prestamo) => {
        // Determinar la fecha base del préstamo
        const fechaBase = prestamo.fechaRenovacion
          ? new Date(prestamo.fechaRenovacion)
          : new Date(prestamo.fechaPrestamo);

        // Verificar las fechas próximas para los próximos 3 meses
        for (let i = 1; i <= 3; i++) {
          const fechaProxima = new Date(fechaBase);
          fechaProxima.setMonth(fechaBase.getMonth() + i);

          // Verificar si la fecha próxima coincide con el día y mes de esta semana
          if (
            fechaProxima.getDate() === diaSemana.diaMes &&
            fechaProxima.getMonth() === diaSemana.mes
          ) {
            prestamosFiltrados.push({
              ...prestamo,
              mesesDiferencia: i, // Guardar la diferencia en meses para colorear
            });
            break; // No necesitas verificar más meses si ya coincide
          }
        }
      });
    });

    return prestamosFiltrados;
  };

  const obtenerColorFondo = (mesesDiferencia: number): string => {
    if (mesesDiferencia === 1) return "bg-green-300";
    if (mesesDiferencia === 2) return "bg-yellow-300"; // Color naranja
    if (mesesDiferencia === 3) return "bg-red-300"; // Color rojo
    return "bg-gray-200"; // Default (fuera de rango)
  };

  return (
    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-2 text-center text-gray-500 dark:text-gray-400 font-body">
        CLIENTES DE LA SEMANA
      </h3>

      <div className="bg-gray-800 text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center font-title">{mes}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {dias.map((dia, index) => (
            <div
              key={index}
              className="bg-gray-200 text-center p-4 rounded-xl shadow-md font-body"
            >
              <h3 className="text-lg font-bold text-black">{dia.diaCompleto}</h3>
              <div className="mt-4 space-y-2">
                {prestamos
                  .filter((prestamo) => {
                    const fechaBase = prestamo.fechaRenovacion
                      ? new Date(prestamo.fechaRenovacion)
                      : new Date(prestamo.fechaPrestamo);

                    for (let i = 1; i <= 3; i++) {
                      const fechaProxima = new Date(fechaBase);
                      fechaProxima.setMonth(fechaBase.getMonth() + i);

                      if (
                        fechaProxima.getDate() === dia.diaMes &&
                        fechaProxima.getMonth() === dia.mes
                      ) {
                        return true;
                      }
                    }
                    return false;
                  })
                  .map((prestamo, idx) => (
                    <div
                      key={idx}
                      className={`text-black text-sm px-2 py-1 rounded-xl shadow-lg ${obtenerColorFondo(
                        prestamo.mesesDiferencia || 1 // Determinar el color basado en la diferencia de meses
                      )}`}
                    >
                      {prestamo.codigo} - {prestamo.monto}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
