const request = require("supertest");
const app = require("../app");
const { asignaciones } = require("../../database/mock/mockData");

beforeEach(() => {
    asignaciones.length = 0;
});

describe("CRUD Asignacion de Responsables", () => {

    test("asignar responsable a una tarea", async () => {
        const res = await request(app)
            .post("/api/asignaciones")
            .send({ taskId: 1, userId: 1 });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.taskId).toBe(1);
        expect(res.body.userId).toBe(1);
    });

    test("cambiar responsable de una tarea", async () => {
        await request(app)
            .post("/api/asignaciones")
            .send({ taskId: 1, userId: 1 });

        const res = await request(app)
            .put("/api/asignaciones/1")
            .send({ newUserId: 2 });

        expect(res.statusCode).toBe(200);
        expect(res.body.userId).toBe(2);
    });

    test("mostrar responsable asignado", async () => {
        await request(app)
            .post("/api/asignaciones")
            .send({ taskId: 2, userId: 3 });

        const res = await request(app)
            .get("/api/asignaciones/tarea/2");

        expect(res.statusCode).toBe(200);
        expect(res.body.taskId).toBe(2);
        expect(res.body.userId).toBe(3);
        expect(res.body.userName).toBe("Pedro");
        expect(res.body.taskTitle).toBe("Tarea 2");
    });
});
