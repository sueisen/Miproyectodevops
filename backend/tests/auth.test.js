const request = require('supertest');
const app = require('../app');

describe('Pruebas unitarias del Issue #3 - Login', () => {

    // primera prueba con Campos vacíos
    test('Campos vacios no permiten enviar el formulario', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: '', password: '' });
        
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Campos vacios no permiten enviar el formulario.');
    });

    // segunda prueba usuario incorrecto
    test('Usuario incorrecto muestra error', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'usuario_falso', password: 'password123' });
        
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Usuario incorrecto muestra error.');
    });

    // tercera prueba contraseña incorrecta
    test('Contraseña incorrecta muestra error', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'campas', password: 'incorrecta_password' });
        
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Contraseña incorrecta muestra error.');
    });

    // cuarta prueba iniciar sesion valido
    test('Usuario valido inicia sesion', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'campas', password: 'idsm41' });
        
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Usuario valido inicia sesion.');
    });
});