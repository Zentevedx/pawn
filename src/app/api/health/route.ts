import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM cliente");
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Error al obtener clientes:", error.message);
    return NextResponse.json(
      { error: "Error al obtener clientes", details: error.message },
      { status: 500 }
    );
  }
}



export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { nombre, carnet, celular } = body;
  
      // Verifica que los campos requeridos estén presentes
      if (!nombre || !carnet || !celular) {
        return NextResponse.json(
          { error: "Faltan campos obligatorios" },
          { status: 400 }
        );
      }
  
      // Inserta el cliente en la base de datos
      const [result] = await pool.query(
        "INSERT INTO cliente (nombre, carnet, celular) VALUES (?, ?, ?)",
        [nombre, carnet, celular]
      );
  
      // Devuelve el cliente agregado
      return NextResponse.json({
        id: result.insertId,
        nombre,
        carnet,
        celular,
      });
    } catch (error: any) {
      // Captura errores de MySQL (como duplicados de carnet)
      console.error("Error al agregar cliente:", error.message);
      return NextResponse.json(
        { error: "Error al agregar cliente", details: error.message },
        { status: 500 }
      );
    }
  }