import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Deshabilitar body parser para manejar archivos
  },
};

export async function POST(req: Request) {
  try {
    const uploadsFolder = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadsFolder, { recursive: true });

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Formato de solicitud no válido" }, { status: 400 });
    }

    const boundary = contentType.split("boundary=")[1];
    if (!boundary) {
      return NextResponse.json({ error: "Límite de formulario no encontrado" }, { status: 400 });
    }

    const decoder = new TextDecoder();
    const reader = req.body?.getReader();
    const chunks: Uint8Array[] = [];

    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader?.read()!;
      if (value) chunks.push(value);
      done = readerDone;
    }

    const body = decoder.decode(Uint8Array.from(chunks.flat()));
    const parts = body.split(`--${boundary}`);

    // Procesar partes del formulario
    let articulo_id: string | null = null;
    let fileName = "";
    let fileData: Uint8Array | null = null;

    for (const part of parts) {
      if (part.includes("Content-Disposition: form-data; name=\"articulo_id\"")) {
        articulo_id = part.split("\r\n\r\n")[1]?.split("\r\n")[0]?.trim();
      }

      if (part.includes("Content-Disposition: form-data; name=\"file\"")) {
        const headersAndData = part.split("\r\n\r\n");
        const headers = headersAndData[0];
        fileName = headers.match(/filename="(.+?)"/)?.[1] || "archivo_sin_nombre";
        fileData = new Uint8Array(Buffer.from(headersAndData[1]?.split("\r\n")[0] || "", "binary"));
      }
    }

    if (!articulo_id || !fileData || !fileName) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // Guardar el archivo en el sistema
    const uniqueFileName = `${Date.now()}-${fileName}`;
    const filePath = path.join(uploadsFolder, uniqueFileName);
    await fs.writeFile(filePath, fileData);

    // Aquí puedes guardar el nombre del archivo en la base de datos (ejemplo con SQL):
    // await pool.query("INSERT INTO foto (nombre, articulo) VALUES (?, ?)", [uniqueFileName, articulo_id]);

    return NextResponse.json({ message: "Archivo subido con éxito", fileName: uniqueFileName });
  } catch (error: any) {
    console.error("Error al procesar la solicitud:", error.message);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
