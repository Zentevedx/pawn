interface PrestamoData {
  codigo: string;
  monto: number;
  cliente: number;
  fecha: string;
  articulo_nombre: string;
  retraso: number;
  file?: File; // El archivo es opcional
}

export class Prestamo {
  codigo: string;
  monto: number;
  cliente: number;
  fecha: string;
  articulo_nombre: string;
  retraso: number;
  file?: File;

  constructor(data: PrestamoData) {
    if (!data.codigo || !data.monto || !data.cliente || !data.fecha || !data.articulo_nombre) {
      throw new Error("Faltan campos obligatorios");
    }

    this.codigo = data.codigo;
    this.monto = data.monto;
    this.cliente = data.cliente;
    this.fecha = data.fecha;
    this.articulo_nombre = data.articulo_nombre;
    this.retraso = data.retraso || 0;
    this.file = data.file;
  }

  toFormData(): FormData {
    const formData = new FormData();
    formData.append("codigo", this.codigo);
    formData.append("monto", this.monto.toString());
    formData.append("cliente", this.cliente.toString());
    formData.append("fecha", this.fecha);
    formData.append("articulo_nombre", this.articulo_nombre);
    formData.append("retraso", this.retraso.toString());
    if (this.file) {
      formData.append("file", this.file);
    }
    return formData;
  }
}
