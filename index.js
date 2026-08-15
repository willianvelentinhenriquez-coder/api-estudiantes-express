const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware esencial para procesar peticiones con cuerpo en formato JSON
app.use(express.json());

// --- DATOS INICIALES EN MEMORIA (HARDCODED) ---
// Estructura adaptada exactamente a la imagen proporcionada
let estudiantes = [
  {
    id: 1,
    firstName: "Juan",
    lastName: "Pérez",
    age: 20,
    email: "juan.perez@email.com",
    phone: "+503 7000 0000",
    address: {
      country: "El Salvador",
      city: "San Salvador"
    },
    isActive: true,
    courses: ["Matemáticas", "Programación", "Base de Datos"]
  },
  {
    id: 2,
    firstName: "Maria",
    lastName: "Gómez",
    age: 22,
    email: "maria.gomez@email.com",
    phone: "+503 7111 2222",
    address: {
      country: "El Salvador",
      city: "Santa Ana"
    },
    isActive: true,
    courses: ["Programación", "Diseño Web"]
  },
  {
    id: 3,
    firstName: "Carlos",
    lastName: "López",
    age: 21,
    email: "carlos.lopez@email.com",
    phone: "+503 7222 3333",
    address: {
      country: "El Salvador",
      city: "San Miguel"
    },
    isActive: false,
    courses: ["Inglés Técnico"]
  }
];

// Variable para el control del ID autoincremental
let nextId = 4;

// --- ENDPOINTS DE LA API REST ---

// 1. GET /api/estudiantes - Obtener la lista completa de estudiantes
app.get('/api/estudiantes', (req, res) => {
  res.status(200).json({
    total: estudiantes.length,
    data: estudiantes
  });
});

// 2. GET /api/estudiantes/:id - Obtener un estudiante específico por ID
app.get('/api/estudiantes/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const estudiante = estudiantes.find(e => e.id === id);

  if (!estudiante) {
    return res.status(404).json({
      error: "Estudiante no encontrado",
      message: `No se encontró ningún estudiante con el ID ${id}`
    });
  }

  res.status(200).json({
    data: estudiante
  });
});

// 3. POST /api/estudiantes - Crear/Agregar un nuevo estudiante
app.post('/api/estudiantes', (req, res) => {
  const { firstName, lastName, age, email, phone, address, courses } = req.body;

  // Validación de campos obligatorios
  if (!firstName || !lastName || !email) {
    return res.status(400).json({
      error: "Campos obligatorios faltantes",
      message: "Los campos 'firstName', 'lastName' y 'email' son requeridos para registrar un estudiante."
    });
  }

  // Creación del nuevo objeto estudiante con ID autoincremental
  const nuevoEstudiante = {
    id: nextId++,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    age: age || null,
    email: email.trim(),
    phone: phone ? phone.trim() : "",
    address: address || { country: "El Salvador", city: "San Salvador" },
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    courses: Array.isArray(courses) ? courses : []
  };

  estudiantes.push(nuevoEstudiante);

  res.status(201).json({
    message: "Estudiante creado con éxito",
    data: nuevoEstudiante
  });
});

// 4. PUT /api/estudiantes/:id - Actualizar los datos de un estudiante existente
app.put('/api/estudiantes/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = estudiantes.findIndex(e => e.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: "Estudiante no encontrado",
      message: `No se puede actualizar. No existe el estudiante con el ID ${id}`
    });
  }

  const { firstName, lastName, age, email, phone, address, isActive, courses } = req.body;

  // Actualización manteniendo los datos actuales si no se envían nuevos valores
  const estudianteActualizado = {
    ...estudiantes[index],
    firstName: firstName !== undefined ? firstName.trim() : estudiantes[index].firstName,
    lastName: lastName !== undefined ? lastName.trim() : estudiantes[index].lastName,
    age: age !== undefined ? age : estudiantes[index].age,
    email: email !== undefined ? email.trim() : estudiantes[index].email,
    phone: phone !== undefined ? phone.trim() : estudiantes[index].phone,
    address: address !== undefined ? address : estudiantes[index].address,
    isActive: isActive !== undefined ? isActive : estudiantes[index].isActive,
    courses: courses !== undefined ? courses : estudiantes[index].courses
  };

  estudiantes[index] = estudianteActualizado;

  res.status(200).json({
    message: "Estudiante actualizado correctamente",
    data: estudianteActualizado
  });
});

// 5. DELETE /api/estudiantes/:id - Eliminar un estudiante por ID
app.delete('/api/estudiantes/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = estudiantes.findIndex(e => e.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: "Estudiante no encontrado",
      message: `No se puede eliminar. No existe el estudiante con el ID ${id}`
    });
  }

  // Remover registro y obtener el elemento eliminado
  const [estudianteEliminado] = estudiantes.splice(index, 1);

  res.status(200).json({
    message: "Estudiante eliminado exitosamente",
    data: estudianteEliminado
  });
});

// Ruta para manejar endpoints inexistentes (404 Global)
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    message: `La ruta ${req.originalUrl} no existe en este servidor.`
  });
});

// --- INICIALIZACIÓN DEL SERVIDOR ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend ejecutándose exitosamente en http://localhost:${PORT}`);
  console.log(`📋 API disponible en http://localhost:${PORT}/api/estudiantes`);
});
