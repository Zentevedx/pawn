import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Deshabilitar el body parser para manejar archivos binarios
  },
};

export async function POST(req: Request) {
  try {
    // Crear la carpeta de subida si no existe
    const uploadsFolder = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadsFolder, { recursive: true });

    // Leer el flujo de datos del archivo
    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Formato no válido" }, { status: 400 });
    }

    // Leer la data del archivo
    const boundary = contentType.split("boundary=")[1];
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
    let fileData: Uint8Array | null = null;
    let fileName = "";

    for (const part of parts) {
      if (part.includes("Content-Disposition: form-data; name=\"file\"")) {
        const headersAndData = part.split("\r\n\r\n");
        const headers = headersAndData[0];
        fileName = headers.match(/filename="(.+?)"/)?.[1] || "archivo_sin_nombre";
        fileData = new Uint8Array(Buffer.from(headersAndData[1]?.split("\r\n")[0] || "", "binary"));
      }
    }

    if (!fileData || !fileName) {
      return NextResponse.json({ error: "No se encontró el archivo" }, { status: 400 });
    }

    // Guardar el archivo en la carpeta uploads
    const uniqueFileName = `${Date.now()}-${fileName}`;
    const filePath = path.join(uploadsFolder, uniqueFileName);
    await fs.writeFile(filePath, fileData);

    return NextResponse.json({ message: "Archivo subido con éxito", fileName: uniqueFileName });
  } catch (error: any) {
    console.error("Error al subir la imagen:", error.message);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
