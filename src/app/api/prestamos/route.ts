import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { codigo, monto, cliente, fecha, articulo_nombre, retraso } = body;

    if (!codigo || !monto || !cliente || !fecha || !articulo_nombre) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // Insertar en la tabla `prestamo`
    const [prestamoResult] = await pool.query(
      "INSERT INTO prestamo (codigo, monto, cliente, fecha, retraso) VALUES (?, ?, ?, ?, ?)",
      [codigo, monto, cliente, fecha, retraso || 0]
    );
    const prestamoId = prestamoResult.insertId;

    // Insertar en la tabla `articulo`
    await pool.query("INSERT INTO articulo (nombre, prestamo) VALUES (?, ?)", [articulo_nombre, prestamoId]);

    return NextResponse.json({ message: "Préstamo registrado con éxito", prestamoId });
  } catch (error: any) {
    console.error("Error al registrar préstamo:", error.message);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
export async function GET() {
  try {
    // Consulta para obtener préstamos junto con sus fechas y otros datos necesarios
    const [rows] = await pool.query(
      `
      SELECT 
        prestamo.codigo,
        prestamo.monto,
        prestamo.fecha AS fechaPrestamo,
        prestamo.fechaRenovacion,
        articulo.nombre AS articuloNombre
      FROM prestamo
      LEFT JOIN articulo ON articulo.prestamo = prestamo.id
      `
    );

    return NextResponse.json(rows); // Devolver datos como JSON
  } catch (error) {
    console.error("Error al obtener préstamos:", error.message);
    return NextResponse.json({ error: "Error al obtener préstamos" }, { status: 500 });
  }
}