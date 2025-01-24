import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CardPrestamo = ({ prestamo }) => {
  const {
    cliente = "Desconocido",
    carnet = "N/A",
    celular = "N/A",
    codigoPrestamo = "N/A",
    monto = 0,
    meses = 0,
    dias = 0,
    porcentaje = 0,
    articulo = "Sin artículo",
    imagenes = [],
    estado = "Desconocido",
  } = prestamo;

  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Configuración del carrusel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Imagen principal del card
  const backgroundImage =
    imagenes && imagenes.length > 0
      ? imagenes[0]
      : "https://via.placeholder.com/300x150"; // Imagen por defecto

  return (
    <>
      {/* Modal de imágenes */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center"
          onClick={closeModal}
        >
          <div className="relative w-11/12 md:w-3/4 lg:w-1/2 h-3/4 bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-2"
            >
              ✕
            </button>
            {imagenes && imagenes.length > 0 ? (
              <Slider {...sliderSettings} className="h-full">
                {imagenes.map((imagen, index) => (
                  <img
                    key={index}
                    src={imagen}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ))}
              </Slider>
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-500">
                Sin imágenes disponibles
              </div>
            )}
          </div>
        </div>
      )}

      {/* Card con imagen de fondo */}
      <div
        className="relative rounded-xl shadow-md overflow-hidden bg-gray-800 text-white p-4 flex gap-4 items-center cursor-pointer"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onClick={openModal} // Abrir el modal al hacer clic en el card
      >
        {/* Fondo de superposición para oscurecer la imagen */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Barra de Progreso Vertical */}
        <div className="relative w-8 h-full bg-gray-300 rounded-full overflow-hidden z-10">
          <div
            className={`absolute bottom-0 w-8 ${
              porcentaje === 100
                ? "bg-red-500"
                : porcentaje >= 66
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            style={{ height: `${porcentaje}%` }}
          ></div>
        </div>

        {/* Información del préstamo */}
        <div className="relative z-10 flex-1">
          <h1 className="text-6xl text-right font-bold mb-2 text-white drop-shadow-lg">
            {codigoPrestamo}
          </h1>
          <p className="text-sm mb-2 text-3xl text-right">
            <span className="font-semibold"></span> {cliente}
          </p>
          <p className="text-sm mb-2 text-2xl text-right">
            <span className="font-semibold ">CI:</span> {carnet}
          </p>
          <p className="text-sm mb-2 text-2xl text-right">
            <span className="font-semibold">Celular:</span> {celular}
          </p>
          <div className="border-t-4 border-dashed border-yellow-500 my-4"></div>

          <p className="text-sm mb-2 text-3xl text-center">
            <span className="font-semibold"></span> {articulo}
          </p>

          <p className="text-sm mb-2 text-5xl text-right">
            Bs.- {monto.toFixed(0)}
          </p>
          <p className="text-sm mb-2 text-center text-4xl ">
            <span className="font-semibold">Tiempo transcurrido:</span> {meses} meses y {dias} días
          </p>
          <p
            className={`text-sm font-semibold text-right ${
              estado === "En venta" ? "text-red-500" : "text-green-500"
            }`}
          >
            {estado}
          </p>
          <p className="text-sm mt-2 text-right">
            <span className="font-semibold">Progreso:</span> {porcentaje.toFixed(2)}%
          </p>
        </div>
      </div>
    </>
  );
};

export default CardPrestamo;
