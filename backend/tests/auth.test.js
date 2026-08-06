const request = require('supertest');
const app = require('../app');
const mockDataService = require('../services/mockData.service');

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

describe('Registro de usuario (mock en memoria)', () => {
    beforeEach(() => {
        mockDataService._resetStores();
    });

    test('registra un usuario nuevo y responde con código 201', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ username: 'nuevo_usuario', password: 'clave123', name: 'Usuario Nuevo' });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.user).toMatchObject({ username: 'nuevo_usuario', name: 'Usuario Nuevo' });
    });

    test('responde 400 si falta usuario o contraseña', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ username: '', password: '' });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });

    test('responde 409 si el usuario ya existe', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ username: 'repetido', password: 'clave123' });

        const response = await request(app)
            .post('/api/auth/register')
            .send({ username: 'repetido', password: 'otraClave' });

        expect(response.statusCode).toBe(409);
        expect(response.body.success).toBe(false);
    });

    test('responde 409 si el usuario coincide con el admin fijo', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ username: 'campas', password: 'clave123' });

        expect(response.statusCode).toBe(409);
    });

    test('un usuario registrado puede iniciar sesión', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ username: 'nuevo_usuario', password: 'clave123' });

        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'nuevo_usuario', password: 'clave123' });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test('un usuario registrado con contraseña incorrecta no inicia sesión', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ username: 'nuevo_usuario', password: 'clave123' });

        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'nuevo_usuario', password: 'incorrecta' });

        expect(response.statusCode).toBe(401);
    });
});