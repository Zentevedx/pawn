"use client";

import { useState } from "react";
import Busqueda from '@/components/Busqueda';
import BotonConModal from "@/components/BotonConModal";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import AgregarCliente from "@/components/AgregarCliente";
import AgregarPrestamo from "@/components/AgregarPrestamo";

export default function Nav({ onRegistrar }: { onRegistrar: () => void }) {
  const [busqueda, setBusqueda] = useState("");

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
  };

  return (
    <nav className="bg-teal-500 dark:bg-teal-700 text-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
      {/* Título */}
      <h1 className="text-2xl font-bold font-title">ZENTEVED - LU</h1>

      <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
          Registrar
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          <MenuItem>
          <BotonConModal titulo="Cliente">
    <AgregarCliente />
      </BotonConModal>
          </MenuItem>
          <MenuItem>
          <BotonConModal titulo="Prestamo">
    <AgregarPrestamo />
      </BotonConModal>
          </MenuItem>
          
        </div>
      </MenuItems>
    </Menu>
     
    <div>
    <BotonConModal titulo="Buscar">
    <Busqueda />
      </BotonConModal>
    </div>

      
    </nav>
  );
}
