import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// Obtener clientes (GET)
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT id, nombre FROM cliente");
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Error al obtener clientes:", error.message);
    return NextResponse.json({ error: "Error al obtener clientes" }, { status: 500 });
  }
}


export async function POST(req: { json: () => any; }) {
  try {
    const body = await req.json();
    const { nombre, carnet, celular } = body;

    // Validar campos obligatorios
    if (!nombre || !carnet || !celular) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Insertar el cliente en la base de datos
    const [result] = await pool.query(
      "INSERT INTO cliente (nombre, carnet, celular) VALUES (?, ?, ?)",
      [nombre, carnet, celular]
    );

    // Devolver respuesta exitosa
    return NextResponse.json({
      id: result.insertId,
      nombre,
      carnet,
      celular,
    });
  } catch (error) {
    console.error("Error al guardar cliente:", error);

    // Manejar errores específicos de MySQL
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: `El cliente con el carnet ${error.sqlMessage.match(/'(.+?)'/)[1]} ya existe.` },
        { status: 400 }
      );
    }

    // Manejar otros errores genéricos
    return NextResponse.json(
      { error: "Error al guardar cliente", details: error.message },
      { status: 500 }
    );
  }
}

