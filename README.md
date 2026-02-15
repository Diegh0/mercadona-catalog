# Catálogo Mercadona – Prueba Técnica

Aplicación desarrollada con Angular 21 que implementa un catálogo jerárquico de productos conforme a las especificaciones del PDF.

## Stack Técnico

- Angular 21 (Standalone Components)
- Angular Signals para gestión de estado
- SCSS
- Vitest + V8 para testing y cobertura

Cobertura de tests: **> 80%**

---

## Arquitectura

Estructura basada en features:
-core/
-models/
-services/
-features/catalog/
-components/
-store/

### Decisiones técnicas destacadas

- Patrón **Smart/Dumb Components**
- Store local implementado con **Angular Signals**
- Servicio de transformación para desacoplar el JSON del modelo de dominio
- Persistencia de estado (selección, navegación, ordenación y scroll) mediante `localStorage`
- Ordenación configurable mediante modelo `SortConfig`

La solución prioriza separación de responsabilidades, mantenibilidad y claridad arquitectónica.

---

## Instalación

Requiere Node 20.19 o superior.

```bash
npm install

##Ejecucion en desarrollo
npm start
##Abrir en navegador
http://localhost:4200/

## TEST
-Ejecutar Test:
npm test
-Cobertura:
npm test -- --coverage



