import { pool } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query || query.trim() === "") {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    console.log("Buscando con query:", query);

    // Consulta principal para obtener préstamos, artículos y fechas
    const [prestamos] = await pool.execute(
      `
      SELECT 
        c.nombre AS cliente,
        c.carnet,
        c.celular,
        p.codigo AS codigoPrestamo,
        p.monto,
        p.fecha AS fechaPrestamo,
        p.fechaRenovacion,
        p.estado,
        a.nombre AS articulo,
        a.id AS articuloId
      FROM cliente c
      LEFT JOIN prestamo p ON c.id = p.cliente
      LEFT JOIN articulo a ON p.id = a.prestamo
      WHERE c.carnet LIKE ? OR p.codigo LIKE ? OR c.nombre LIKE ?
      `,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );

    console.log("Préstamos obtenidos:", prestamos);

    // Añadir imágenes, calcular tiempo, porcentaje y determinar estado
    const prestamosConDatos = await Promise.all(
      prestamos.map(async (prestamo) => {
        const fechaBase = new Date(prestamo.fechaRenovacion || prestamo.fechaPrestamo); // Usar fechaRenovacion si existe
        const hoy = new Date();

        // Calcular meses y días
        let diferenciaMeses =
          hoy.getFullYear() * 12 +
          hoy.getMonth() -
          (fechaBase.getFullYear() * 12 + fechaBase.getMonth());
        let diferenciaDias = hoy.getDate() - fechaBase.getDate();

        // Ajustar días negativos y meses
        if (diferenciaDias < 0) {
          diferenciaMeses -= 1; // Resta un mes si los días son negativos
          const diasEnMesAnterior = new Date(
            hoy.getFullYear(),
            hoy.getMonth(),
            0
          ).getDate(); // Días del mes anterior
          diferenciaDias += diasEnMesAnterior;
        }

        // Calcular porcentaje de tiempo transcurrido
        const totalDias = diferenciaMeses * 30 + diferenciaDias; // Días totales transcurridos
        const porcentaje = Math.min((totalDias / (3 * 30)) * 100, 100); // Máximo 100%

        // Determinar si debe estar en venta
        const estado = diferenciaMeses >= 3 ? "En venta" : "Activo";

        // Obtener imágenes del artículo
        const [imagenes] = await pool.execute(
          "SELECT nombre FROM foto WHERE articulo = ?",
          [prestamo.articuloId]
        );

        return {
          ...prestamo,
          estado, // Estado actualizado
          meses: diferenciaMeses,
          dias: diferenciaDias,
          porcentaje, // Progreso en porcentaje
          imagenes: imagenes.map((img) => `http://localhost/zenteved_api/uploads/${img.nombre}`), // Construir URLs de imágenes
        };
      })
    );

    return new Response(JSON.stringify(prestamosConDatos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en la API:", error);
    return new Response(JSON.stringify({ error: "Error al realizar la búsqueda" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
