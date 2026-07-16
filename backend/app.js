const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta principal para pruebas de integración (incoming)
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Servidor funcionando correctamente"
  });
});

// Ruta para el código login (current)
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    // Validación de datos
    if (!username || !password || username.trim() === "" || password.trim() === "") {
        return res.status(400).json({ success: false, message: 'Campos vacios no permiten enviar el formulario.' });
    }

    // Simulación de datos para entrar al login
    const usuarioValido = "campas";
    const contrasenaValida = "idsm41";

    // En caso de usuario invalido
    if (username !== usuarioValido) {
        return res.status(401).json({ success: false, message: 'Usuario incorrecto muestra error.' });
    }

    // Caso de contraseña invalida
    if (password !== contrasenaValida) {
        return res.status(401).json({ success: false, message: 'Contraseña incorrecta muestra error.' });
    }

    // Caso de validación correcto
    return res.status(200).json({ 
        success: true, 
        message: 'Usuario valido inicia sesion.',
        user: { username: usuarioValido }
    });
});

// Ejecución del servidor solo si se corre directamente
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  });
}

module.exports = app;