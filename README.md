Catálogo Mercadona – Prueba Técnica
Descripción

Aplicación desarrollada con Angular 21 que implementa un catálogo jerárquico de productos siguiendo las especificaciones del PDF.

Funcionalidades implementadas:

Layout de dos columnas con scroll independiente

Navegación jerárquica de productos (n niveles)

Botón “Atrás”

Buscador (mínimo 3 caracteres, solo columna derecha)

Ordenación configurable ASC/DESC

Persistencia de estado tras refresh (selección, ordenación y scroll)

Diseño responsive

Tests unitarios y de comportamiento

Cobertura de tests: > 80%

Stack técnico

Angular 21 (Standalone Components)

Angular Signals para gestión de estado

SCSS

Vitest (testing + coverage)

Arquitectura

Estructura basada en features:

core/ (modelos y servicios)
features/catalog/ (store + componentes)


Patrón Smart/Dumb Components

Store local con Signals

Servicio de transformación para desacoplar el JSON del modelo de dominio

Persistencia en localStorage

Instalación y ejecución

Requiere Node 20.19+

Instalar dependencias:

npm install


Ejecutar aplicación:

npm start


Ejecutar tests:

npm test


Ejecutar tests con cobertura:

npm test -- --coverage


Build producción:

npm run build

Notas

El JSON se sirve desde assets mediante HttpClient.

La solución prioriza claridad arquitectónica, separación de responsabilidades y mantenibilidad.
