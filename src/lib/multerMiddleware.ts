import multer from "multer";
import path from "path";
import { promises as fs } from "fs";

// Configuración del almacenamiento de archivos
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix); // Nombre único para cada archivo
  },
});

const upload = multer({ storage });

export default upload;
