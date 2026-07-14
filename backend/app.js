const express = require('express');
const app = express ();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ruta para el codigo login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    // validacion de datos
    if (!username || !password || username.trim() === "" || password.trim() === "") {
        return res.status(400).json({ success: false, message: 'Campos vacios no permiten enviar el formulario.' });
    }

    // simulacion de datos para entrar al login
    const usuarioValido = "campas";
    const contrasenaValida = "idsm41";

    // en caso de usuario invalido
    if (username !== usuarioValido) {
        return res.status(401).json({ success: false, message: 'Usuario incorrecto muestra error.' });
    }

    // caso de contraseña invalida
    if (password !== contrasenaValida) {
        return res.status(401).json({ success: false, message: 'Contraseña incorrecta muestra error.' });
    }

    // caso de validacion correcto
    return res.status(200).json({ 
        success: true, 
        message: 'Usuario valido inicia sesion.',
        user: { username: usuarioValido }
    });
});

module.exports = app;