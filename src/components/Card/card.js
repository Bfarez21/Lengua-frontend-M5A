import React from 'react';

// Componente de Tarjeta
export const Card = ({ children, className = '', ...props }) => (
  <div
    className={`bg-white rounded-2xl shadow-lg transition-transform transform hover:scale-105 p-6 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Componente de Cabecera de la Tarjeta
export const CardHeader = ({ children }) => (
  <div className="mb-4 border-b border-gray-300 pb-2">
    {children}
  </div>
);

// Componente de Título de la Tarjeta
export const CardTitle = ({ children }) => (
  <h2 className="text-2xl font-semibold text-gray-800">
    {children}
  </h2>
);

// Componente de Descripción de la Tarjeta
export const CardDescription = ({ children }) => (
  <p className="text-md text-gray-600 italic">
    {children}
  </p>
);

// Componente de Contenido de la Tarjeta
export const CardContent = ({ children }) => (
  <div className="text-gray-700">
    {children}
  </div>
);

// Ejemplo de uso de los componentes de la tarjeta
/*
<Card>
  <CardHeader>
    <CardTitle>Título de la Tarjeta</CardTitle>
    <CardDescription>Descripción corta de la tarjeta.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Aquí va el contenido principal de la tarjeta.</p>
  </CardContent>
</Card>
*/