import { useState } from "react";

export default function BotonConModal({ children, titulo }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* Botón para abrir el modal */}
      <button
        className="bg-white text-black font-bold py-2 px-4 rounded hover:bg-green-200"
        onClick={openModal}
      >
        {titulo || "Abrir Modal"}
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={closeModal} // Cerrar al hacer clic fuera del contenido
        >
          <div
            className="relative bg-white rounded-lg shadow-lg w-[85%] h-[85%] p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Evitar cerrar al hacer clic en el contenido
          >
            {/* Botón para cerrar */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              ✕
            </button>

            {/* Contenido del Modal */}
            <div className="mt-4">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
