# SKILL: Odontograma Visual - Metadata para Renderizado Frontend

> **Versión:** 2.0  
> **Fecha:** Mayo 2026  
> **Extensión de:** SKILL_ODONTOGRAMA.md original  
> **Objetivo:** Agregar metadata visual al odontograma para interfaz realista

---

## 🎯 OBJETIVO DE ESTA SKILL

Extender el sistema de odontograma existente para que el backend proporcione **metadata visual** que permita al frontend renderizar una interfaz gráfica profesional como la mostrada en la imagen de referencia del usuario, con:

- Representación visual de cada diente (círculos/SVG)
- División visible de superficies (M, D, O, V, L, P)
- Colores diferenciados por estado clínico
- Posicionamiento correcto en cuadrantes
- Interactividad por superficie

---

## 📋 PREREQUISITOS

Antes de usar esta skill, debes haber completado:

- ✅ SKILL_ODONTOGRAMA.md original (modelo de datos + endpoints básicos)
- ✅ Endpoints existentes funcionando:
  - `POST /odontograma/inicializar`
  - `PUT /odontograma/diente/:codigoFDI`
  - `GET /odontograma`

---

## 🏗️ ARQUITECTURA DE SOLUCIÓN

### Flujo de datos:

```
┌─────────────┐
│   MongoDB   │ ← Datos clínicos puros (FDI, estados, superficies)
└──────┬──────┘
       │
       ↓
┌──────────────────────────┐
│  odontogramaVisualUtils  │ ← Enriquece con metadata visual
└──────┬───────────────────┘
       │
       ↓
┌──────────────────────┐
│  Endpoint /visual    │ ← JSON con datos clínicos + visual
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│  Frontend (React)    │ ← Renderiza SVG con datos enriquecidos
└──────────────────────┘
```

---

## 📁 PASO 1: Crear Utilidades Visuales

### Archivo: `src/utils/odontogramaVisualUtils.js`

**Crear nuevo archivo** con las siguientes funciones:

```javascript
/**
 * Utilidades para metadata visual de odontogramas
 * Generan datos necesarios para renderizado frontend
 */

/**
 * Obtiene metadata visual completa para un diente
 * @param {String} codigoFDI - Código FDI (ej: "11", "23", "55")
 * @param {String} estadoGeneral - Estado general del diente
 * @returns {Object} Metadata visual
 */
function obtenerMetadataVisual(codigoFDI, estadoGeneral) {
  const cuadrante = parseInt(codigoFDI[0]);
  const posicion = parseInt(codigoFDI[1]);
  
  return {
    coordenadas: calcularCoordenadas(cuadrante, posicion),
    colorPrincipal: obtenerColorEstado(estadoGeneral),
    forma: obtenerFormaDiente(posicion, cuadrante),
    geometriaSuperficies: obtenerGeometriaSuperficies(posicion, cuadrante),
    cuadrante,
    posicion,
    esTemporal: cuadrante >= 5,
    nombreDescriptivo: obtenerNombreDiente(codigoFDI)
  };
}

/**
 * Calcula coordenadas X/Y para posicionar diente en layout visual
 * Layout tipo "boca abierta" vista desde arriba
 * 
 * @param {Number} cuadrante - 1-8 según FDI
 * @param {Number} posicion - 1-8 (permanente) o 1-5 (temporal)
 * @returns {Object} { x, y, cuadrante }
 */
function calcularCoordenadas(cuadrante, posicion) {
  // Configuración de layouts por cuadrante
  const layouts = {
    // Cuadrante 1: Superior derecho (18 → 11)
    1: { 
      baseX: 400, 
      baseY: 100, 
      direccion: -1,  // De derecha a izquierda
      descripcion: 'Superior Derecho'
    },
    
    // Cuadrante 2: Superior izquierdo (21 → 28)
    2: { 
      baseX: 450, 
      baseY: 100, 
      direccion: 1,   // De izquierda a derecha
      descripcion: 'Superior Izquierdo'
    },
    
    // Cuadrante 3: Inferior izquierdo (31 → 38)
    3: { 
      baseX: 450, 
      baseY: 300, 
      direccion: 1,   // De izquierda a derecha
      descripcion: 'Inferior Izquierdo'
    },
    
    // Cuadrante 4: Inferior derecho (41 → 48)
    4: { 
      baseX: 400, 
      baseY: 300, 
      direccion: -1,  // De derecha a izquierda
      descripcion: 'Inferior Derecho'
    },
    
    // Cuadrantes temporales (5-8) - misma lógica
    5: { baseX: 400, baseY: 100, direccion: -1, descripcion: 'Superior Derecho Temporal' },
    6: { baseX: 450, baseY: 100, direccion: 1, descripcion: 'Superior Izquierdo Temporal' },
    7: { baseX: 450, baseY: 300, direccion: 1, descripcion: 'Inferior Izquierdo Temporal' },
    8: { baseX: 400, baseY: 300, direccion: -1, descripcion: 'Inferior Derecho Temporal' }
  };
  
  const layout = layouts[cuadrante];
  const espaciado = 55; // Píxeles entre dientes
  
  return {
    x: layout.baseX + (layout.direccion * posicion * espaciado),
    y: layout.baseY,
    cuadrante,
    descripcionCuadrante: layout.descripcion
  };
}

/**
 * Obtiene color hexadecimal según estado clínico
 * Estándar odontológico profesional:
 * - ROJO = Patologías
 * - AZUL = Tratamientos realizados
 * - AMARILLO = Pendientes
 * - GRIS = Ausentes
 * 
 * @param {String} estado - Estado clínico
 * @returns {String} Color hex
 */
function obtenerColorEstado(estado) {
  const colores = {
    // ===== ESTADOS NORMALES =====
    'SANO': '#FFFFFF',  // Blanco
    
    // ===== PATOLOGÍAS (ROJO) =====
    'CARIES': '#FF0000',                    // Rojo intenso
    'EXTRACCION_INDICADA': '#FF6B6B',       // Rojo claro
    'PERDIDA_POR_CARIES': '#CC0000',        // Rojo oscuro
    'PERDIDA_OTRA_CAUSA': '#999999',        // Gris
    
    // ===== TRATAMIENTOS REALIZADOS (AZUL) =====
    'OBTURADO': '#0000FF',                  // Azul intenso
    'SELLANTE_REALIZADO': '#4169E1',        // Azul royal
    'ENDODONCIA': '#000080',                // Azul marino
    'CORONA': '#1E90FF',                    // Azul dodge
    
    // ===== PRÓTESIS (AZUL OSCURO) =====
    'PROTESIS_FIJA': '#00008B',             // Azul oscuro
    'PROTESIS_REMOVIBLE': '#4682B4',        // Azul acero
    'PROTESIS_TOTAL': '#191970',            // Azul midnight
    
    // ===== PENDIENTES (AMARILLO) =====
    'SELLANTE_NECESARIO': '#FFD700'         // Dorado
  };
  
  return colores[estado] || '#FFFFFF';
}

/**
 * Determina forma del diente para seleccionar geometría correcta
 * @param {Number} posicion - Posición en cuadrante (1-8)
 * @param {Number} cuadrante - Cuadrante (1-8)
 * @returns {String} Tipo de diente
 */
function obtenerFormaDiente(posicion, cuadrante) {
  const esTemporal = cuadrante >= 5;
  
  if (esTemporal) {
    // Dientes temporales (1-5)
    if (posicion <= 2) return 'incisivo_temporal';
    if (posicion === 3) return 'canino_temporal';
    return 'molar_temporal';
  } else {
    // Dientes permanentes (1-8)
    if (posicion <= 2) return 'incisivo';
    if (posicion === 3) return 'canino';
    if (posicion <= 5) return 'premolar';
    return 'molar';
  }
}

/**
 * Define paths SVG para cada superficie según tipo de diente
 * Retorna coordenadas path para dibujar divisiones en el diente
 * 
 * @param {Number} posicion - Posición del diente
 * @param {Number} cuadrante - Cuadrante
 * @returns {Object} Geometría de superficies con paths SVG
 */
function obtenerGeometriaSuperficies(posicion, cuadrante) {
  const forma = obtenerFormaDiente(posicion, cuadrante);
  
  // Geometrías base para círculo de 40px de diámetro
  const geometrias = {
    // ===== INCISIVOS =====
    incisivo: {
      M: { 
        path: 'M 20,0 L 10,5 L 10,35 L 20,40 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'M',
        labelX: 12,
        labelY: 22
      },
      D: { 
        path: 'M 20,0 L 30,5 L 30,35 L 20,40 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'D',
        labelX: 28,
        labelY: 22
      },
      O: { 
        path: 'M 10,5 L 30,5 L 30,12 L 10,12 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'O',
        labelX: 20,
        labelY: 10
      },
      V: { 
        path: 'M 10,12 L 30,12 L 30,20 L 10,20 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'V',
        labelX: 20,
        labelY: 17
      },
      L: { 
        path: 'M 10,20 L 30,20 L 30,28 L 10,28 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'L',
        labelX: 20,
        labelY: 25
      },
      P: { 
        path: 'M 10,28 L 30,28 L 30,35 L 10,35 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'P',
        labelX: 20,
        labelY: 33
      }
    },
    
    // ===== CANINOS =====
    canino: {
      M: { 
        path: 'M 20,0 L 8,8 L 8,32 L 20,40 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'M',
        labelX: 12,
        labelY: 22
      },
      D: { 
        path: 'M 20,0 L 32,8 L 32,32 L 20,40 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'D',
        labelX: 28,
        labelY: 22
      },
      O: { 
        path: 'M 8,8 L 32,8 L 28,15 L 12,15 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'O',
        labelX: 20,
        labelY: 12
      },
      V: { 
        path: 'M 12,15 L 28,15 L 28,22 L 12,22 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'V',
        labelX: 20,
        labelY: 19
      },
      L: { 
        path: 'M 12,22 L 28,22 L 28,28 L 12,28 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'L',
        labelX: 20,
        labelY: 26
      },
      P: { 
        path: 'M 12,28 L 28,28 L 32,32 L 8,32 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'P',
        labelX: 20,
        labelY: 31
      }
    },
    
    // ===== PREMOLARES =====
    premolar: {
      M: { 
        path: 'M 20,0 L 5,10 L 5,30 L 20,40 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'M',
        labelX: 11,
        labelY: 22
      },
      D: { 
        path: 'M 20,0 L 35,10 L 35,30 L 20,40 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'D',
        labelX: 29,
        labelY: 22
      },
      O: { 
        path: 'M 5,10 L 35,10 L 30,17 L 10,17 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'O',
        labelX: 20,
        labelY: 14
      },
      V: { 
        path: 'M 10,17 L 30,17 L 30,23 L 10,23 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'V',
        labelX: 20,
        labelY: 21
      },
      L: { 
        path: 'M 10,23 L 30,23 L 30,30 L 10,30 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'L',
        labelX: 20,
        labelY: 27
      },
      P: { 
        path: 'M 10,30 L 30,30 L 35,30 L 5,30 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'P',
        labelX: 20,
        labelY: 32
      }
    },
    
    // ===== MOLARES =====
    molar: {
      M: { 
        path: 'M 20,0 L 3,12 L 3,28 L 20,40 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'M',
        labelX: 10,
        labelY: 22
      },
      D: { 
        path: 'M 20,0 L 37,12 L 37,28 L 20,40 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'D',
        labelX: 30,
        labelY: 22
      },
      O: { 
        path: 'M 3,12 L 37,12 L 32,18 L 8,18 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'O',
        labelX: 20,
        labelY: 16
      },
      V: { 
        path: 'M 8,18 L 32,18 L 32,24 L 8,24 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'V',
        labelX: 20,
        labelY: 22
      },
      L: { 
        path: 'M 8,24 L 32,24 L 32,28 L 8,28 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'L',
        labelX: 20,
        labelY: 27
      },
      P: { 
        path: 'M 8,28 L 32,28 L 37,28 L 3,28 Z', 
        fill: 'rgba(0,0,0,0.1)',
        label: 'P',
        labelX: 20,
        labelY: 30
      }
    }
  };
  
  // Dientes temporales usan mismas geometrías pero más pequeñas
  geometrias.incisivo_temporal = geometrias.incisivo;
  geometrias.canino_temporal = geometrias.canino;
  geometrias.molar_temporal = geometrias.molar;
  
  return geometrias[forma] || geometrias.molar;
}

/**
 * Importar función existente de odontogramaUtils.js
 */
const { obtenerNombreDiente } = require('./odontogramaUtils');

module.exports = {
  obtenerMetadataVisual,
  calcularCoordenadas,
  obtenerColorEstado,
  obtenerFormaDiente,
  obtenerGeometriaSuperficies
};
```

---

## 📁 PASO 2: Crear Endpoint Visual

### Archivo: `src/controllers/historialClinicoController.js`

**Agregar nueva función** al controlador existente:

```javascript
// Importar utilidad visual al inicio del archivo
const { 
  generarOdontogramaInicial, 
  validarCodigoFDI, 
  obtenerNombreDiente 
} = require('../utils/odontogramaUtils');

// ⬇️ NUEVA IMPORTACIÓN
const { obtenerMetadataVisual } = require('../utils/odontogramaVisualUtils');

// ... código existente ...

/**
 * Obtener odontograma enriquecido con metadata visual
 * GET /api/historial-clinico/:pacienteId/consulta/:consultaId/odontograma/visual
 * 
 * Retorna los mismos datos clínicos + metadata para renderizado frontend
 */
const obtenerOdontogramaVisual = async (req, res) => {
  try {
    const { pacienteId, consultaId } = req.params;
    
    console.log(`📊 Obteniendo odontograma visual - Paciente: ${pacienteId}, Consulta: ${consultaId}`);
    
    // Obtener historial clínico
    const historial = await HistorialClinico.findOne({ 
      paciente: pacienteId,
      activo: true 
    }).populate('consultas.doctor', 'nombre apellido especialidad');
    
    if (!historial) {
      return res.status(404).json({ 
        exito: false,
        mensaje: 'Historial clínico no encontrado' 
      });
    }
    
    // Buscar consulta específica
    const consulta = historial.consultas.id(consultaId);
    
    if (!consulta) {
      return res.status(404).json({ 
        exito: false,
        mensaje: 'Consulta no encontrada' 
      });
    }
    
    // Verificar que el odontograma esté inicializado
    if (!consulta.odontograma || !consulta.odontograma.dientes || consulta.odontograma.dientes.length === 0) {
      return res.status(404).json({ 
        exito: false,
        mensaje: 'Odontograma no inicializado. Use /inicializar primero.' 
      });
    }
    
    // Enriquecer cada diente con metadata visual
    const odontogramaEnriquecido = {
      ...consulta.odontograma.toObject(),
      dientes: consulta.odontograma.dientes.map(diente => {
        const dienteObj = diente.toObject();
        
        return {
          ...dienteObj,
          // ⬇️ METADATA VISUAL AÑADIDA
          visual: obtenerMetadataVisual(
            dienteObj.codigoFDI, 
            dienteObj.estadoGeneral
          )
        };
      })
    };
    
    res.json({
      exito: true,
      odontograma: odontogramaEnriquecido,
      metadata: {
        totalDientes: odontogramaEnriquecido.dientes.length,
        tipoDenticion: odontogramaEnriquecido.tipoDenticion,
        fechaActualizacion: odontogramaEnriquecido.fechaActualizacion
      }
    });
    
  } catch (error) {
    console.error('❌ Error en obtenerOdontogramaVisual:', error);
    res.status(500).json({ 
      exito: false,
      mensaje: 'Error al obtener odontograma visual',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ⬇️ EXPORTAR LA NUEVA FUNCIÓN
module.exports = {
  // ... exportaciones existentes ...
  obtenerOdontogramaVisual  // ← AÑADIR ESTA LÍNEA
};
```

---

## 📁 PASO 3: Agregar Ruta

### Archivo: `src/routers/historialClinicoRoutes.js`

**Agregar nueva ruta** después de las rutas de odontograma existentes:

```javascript
const { 
  // ... imports existentes ...
  obtenerOdontogramaVisual  // ← AÑADIR ESTA IMPORTACIÓN
} = require('../controllers/historialClinicoController');

// ... rutas existentes ...

// ===== RUTAS DE ODONTOGRAMA =====

// Ruta existente (mantener)
router.get(
  '/:pacienteId/consulta/:consultaId/odontograma',
  protegerRuta,
  autorizarRoles('doctor', 'admin'),
  obtenerOdontograma
);

// ⬇️ NUEVA RUTA PARA ODONTOGRAMA VISUAL
router.get(
  '/:pacienteId/consulta/:consultaId/odontograma/visual',
  protegerRuta,
  autorizarRoles('doctor', 'admin'),
  obtenerOdontogramaVisual
);

// ... más rutas ...
```

**IMPORTANTE:** La ruta `/visual` debe ir **ANTES** de rutas con parámetros dinámicos para evitar conflictos.

---

## 📊 PASO 4: Estructura de Respuesta

### Ejemplo de JSON retornado:

```json
{
  "exito": true,
  "odontograma": {
    "fechaActualizacion": "2026-05-23T15:30:00.000Z",
    "tipoDenticion": "permanente",
    "observaciones": "",
    "dientes": [
      {
        "_id": "664a1b2c3d4e5f6g7h8i9j0k",
        "codigoFDI": "11",
        "estadoGeneral": "SANO",
        "superficies": {
          "M": { "estado": "SANO", "observacion": "" },
          "D": { "estado": "SANO", "observacion": "" },
          "O": { "estado": "SANO", "observacion": "" },
          "V": { "estado": "SANO", "observacion": "" },
          "L": { "estado": "SANO", "observacion": "" },
          "P": { "estado": "SANO", "observacion": "" }
        },
        "movilidad": null,
        "tratamientosPendientes": [],
        "observaciones": "",
        
        "visual": {
          "coordenadas": {
            "x": 345,
            "y": 100,
            "cuadrante": 1,
            "descripcionCuadrante": "Superior Derecho"
          },
          "colorPrincipal": "#FFFFFF",
          "forma": "incisivo",
          "geometriaSuperficies": {
            "M": {
              "path": "M 20,0 L 10,5 L 10,35 L 20,40 Z",
              "fill": "rgba(0,0,0,0.1)",
              "label": "M",
              "labelX": 12,
              "labelY": 22
            },
            "D": {
              "path": "M 20,0 L 30,5 L 30,35 L 20,40 Z",
              "fill": "rgba(0,0,0,0.1)",
              "label": "D",
              "labelX": 28,
              "labelY": 22
            },
            ...
          },
          "cuadrante": 1,
          "posicion": 1,
          "esTemporal": false,
          "nombreDescriptivo": "Incisivo central superior derecho (11)"
        }
      },
      
      {
        "codigoFDI": "23",
        "estadoGeneral": "CARIES",
        "superficies": {
          "M": { "estado": "SANO", "observacion": "" },
          "D": { "estado": "CARIES", "observacion": "Caries profunda" },
          ...
        },
        
        "visual": {
          "coordenadas": { "x": 500, "y": 100, "cuadrante": 2 },
          "colorPrincipal": "#FF0000",
          "forma": "canino",
          ...
        }
      }
    ]
  },
  "metadata": {
    "totalDientes": 32,
    "tipoDenticion": "permanente",
    "fechaActualizacion": "2026-05-23T15:30:00.000Z"
  }
}
```

---

## 🧪 PASO 5: Testing

### 1. Test con Postman/Insomnia:

```http
GET http://localhost:5000/api/historial-clinico/{{pacienteId}}/consulta/{{consultaId}}/odontograma/visual
Authorization: Bearer {{token}}
```

**Verificar:**
- ✅ Campo `visual` presente en cada diente
- ✅ Coordenadas X/Y calculadas correctamente
- ✅ Colores corresponden a estados
- ✅ Geometría de superficies incluida

### 2. Test unitario (opcional):

```javascript
// tests/odontogramaVisual.test.js

const { obtenerMetadataVisual } = require('../src/utils/odontogramaVisualUtils');

describe('Metadata Visual - Odontograma', () => {
  
  test('Debe calcular coordenadas correctas para diente 11', () => {
    const metadata = obtenerMetadataVisual('11', 'SANO');
    expect(metadata.coordenadas.cuadrante).toBe(1);
    expect(metadata.coordenadas.x).toBeLessThan(400);
  });
  
  test('Debe asignar color rojo a caries', () => {
    const metadata = obtenerMetadataVisual('23', 'CARIES');
    expect(metadata.colorPrincipal).toBe('#FF0000');
  });
  
  test('Debe identificar diente temporal', () => {
    const metadata = obtenerMetadataVisual('55', 'SANO');
    expect(metadata.esTemporal).toBe(true);
    expect(metadata.forma).toBe('molar_temporal');
  });
  
});
```

---

## 🎨 PASO 6: Guía para Frontend

### Componente React Ejemplo:

```jsx
// components/Odontograma/OdontogramaVisual.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const OdontogramaVisual = ({ pacienteId, consultaId }) => {
  const [odontograma, setOdontograma] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOdontograma = async () => {
      try {
        const response = await axios.get(
          `/api/historial-clinico/${pacienteId}/consulta/${consultaId}/odontograma/visual`
        );
        setOdontograma(response.data.odontograma);
      } catch (error) {
        console.error('Error al cargar odontograma:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOdontograma();
  }, [pacienteId, consultaId]);
  
  if (loading) return <div>Cargando odontograma...</div>;
  if (!odontograma) return <div>Odontograma no disponible</div>;
  
  return (
    <svg width="900" height="500" viewBox="0 0 900 500">
      {/* Renderizar cada diente */}
      {odontograma.dientes.map(diente => (
        <DienteVisual 
          key={diente.codigoFDI} 
          diente={diente} 
        />
      ))}
      
      {/* Leyenda de colores */}
      <LeyendaEstados />
    </svg>
  );
};

const DienteVisual = ({ diente }) => {
  const { visual, superficies, codigoFDI } = diente;
  
  return (
    <g transform={`translate(${visual.coordenadas.x}, ${visual.coordenadas.y})`}>
      {/* Círculo base */}
      <circle 
        cx="20" 
        cy="20" 
        r="18" 
        fill={visual.colorPrincipal}
        stroke="#333"
        strokeWidth="2"
      />
      
      {/* Superficies clickeables */}
      {Object.entries(visual.geometriaSuperficies).map(([cara, geo]) => (
        <path
          key={cara}
          d={geo.path}
          fill={obtenerColorSuperficie(superficies[cara].estado)}
          stroke="#000"
          strokeWidth="0.5"
          opacity="0.7"
          className="superficie-clickeable"
          onClick={() => console.log(`Clicked: ${codigoFDI} - ${cara}`)}
        />
      ))}
      
      {/* Número FDI */}
      <text 
        x="20" 
        y="25" 
        textAnchor="middle" 
        fontSize="10" 
        fontWeight="bold"
        fill="#000"
      >
        {codigoFDI}
      </text>
    </g>
  );
};

function obtenerColorSuperficie(estadoSuperficie) {
  const colores = {
    'SANO': 'rgba(255,255,255,0.5)',
    'CARIES': 'rgba(255,0,0,0.7)',
    'OBTURADO': 'rgba(0,0,255,0.7)',
    'SELLANTE_REALIZADO': 'rgba(65,105,225,0.7)'
  };
  return colores[estadoSuperficie] || 'rgba(255,255,255,0.5)';
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Backend:

- [ ] Crear `src/utils/odontogramaVisualUtils.js`
- [ ] Implementar `obtenerMetadataVisual()`
- [ ] Implementar `calcularCoordenadas()`
- [ ] Implementar `obtenerColorEstado()`
- [ ] Implementar `obtenerFormaDiente()`
- [ ] Implementar `obtenerGeometriaSuperficies()`
- [ ] Agregar `obtenerOdontogramaVisual()` al controlador
- [ ] Agregar ruta en `historialClinicoRoutes.js`
- [ ] Probar endpoint con Postman
- [ ] Verificar respuesta JSON contiene campo `visual`

### Frontend (guía):

- [ ] Crear componente `OdontogramaVisual.jsx`
- [ ] Crear componente `DienteVisual.jsx`
- [ ] Crear componente `SuperficieClickeable.jsx`
- [ ] Implementar fetch a endpoint `/visual`
- [ ] Renderizar SVG con coordenadas de backend
- [ ] Aplicar colores desde `visual.colorPrincipal`
- [ ] Hacer superficies clickeables
- [ ] Agregar leyenda de estados
- [ ] Probar con datos reales

---

## 🎓 NOTAS IMPORTANTES

### 1. Compatibilidad con endpoints existentes

Esta skill **NO reemplaza** los endpoints originales. Mantén:

- `GET /odontograma` → Datos puros (sin visual)
- `GET /odontograma/visual` → Datos + metadata visual

### 2. Performance

La generación de metadata visual es ligera (~1ms por diente). Para 32 dientes = ~32ms adicionales, aceptable.

### 3. Escalabilidad

Si en el futuro necesitas otras vistas (ej: "vista lateral", "vista 3D"), solo agrega campos a `visual`:

```javascript
visual: {
  coordenadas: {...},
  colorPrincipal: "...",
  // Nuevas vistas
  vistaLateral: {...},
  vista3D: {...}
}
```

### 4. Separación de responsabilidades

- **Backend:** Datos clínicos + metadata visual básica
- **Frontend:** Interactividad, animaciones, UX

---

## 🚀 RESULTADO FINAL

Con esta implementación, el frontend recibirá datos listos para:

1. ✅ Dibujar cada diente en su posición correcta
2. ✅ Colorear según estado clínico
3. ✅ Dividir superficies visualmente
4. ✅ Hacer superficies clickeables
5. ✅ Mostrar información al hover
6. ✅ Actualizar estados en tiempo real

**Todo sin duplicar lógica de negocio en el frontend.**

---

## 📞 SOPORTE

Si encuentras problemas:

1. Verifica que los endpoints originales funcionen
2. Revisa que las importaciones sean correctas
3. Confirma que el odontograma esté inicializado
4. Valida la respuesta JSON con Postman

**Tiempo estimado de implementación:** 3-4 horas backend + testing.
