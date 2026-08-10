/**
 * Pruebas automatizadas de los endpoints CRUD.
 *
 * Responsable:
 * RAMIREZ LLANAS JONATHAN EDUARDO
 */

const request = require("supertest");
const app = require("../app");
const taskService = require("../services/task.service");

describe("API REST CRUD de tareas", () => {
  beforeEach(() => {
    taskService.resetTasks();
  });

  describe("GET /api/tasks", () => {
    test("GET devuelve datos", async () => {
      const response = await request(app).get("/api/tasks");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.tasks)).toBe(true);
      expect(response.body.tasks.length).toBeGreaterThan(0);
    });
  });

  describe("POST /api/tasks", () => {
    test("POST crea registros", async () => {
      const newTask = {
        title: "Probar endpoint POST",
        description: "Comprobar la creación de registros",
        status: "pendiente"
      };

      const response = await request(app)
        .post("/api/tasks")
        .send(newTask);

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.task).toHaveProperty("id");
      expect(response.body.task.title).toBe(newTask.title);
    });

    test("POST rechaza registros sin título", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .send({
          description: "Registro sin título"
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/tasks/:id", () => {
    test("PUT actualiza registros", async () => {
      const response = await request(app)
        .put("/api/tasks/1")
        .send({
          title: "Tarea actualizada",
          description: "Registro actualizado mediante PUT",
          status: "completada"
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.task.id).toBe(1);
      expect(response.body.task.title).toBe("Tarea actualizada");
      expect(response.body.task.status).toBe("completada");
    });

    test("PUT devuelve 404 si el registro no existe", async () => {
      const response = await request(app)
        .put("/api/tasks/999")
        .send({
          title: "Registro inexistente"
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    test("DELETE elimina registros", async () => {
      const deleteResponse = await request(app)
        .delete("/api/tasks/1");

      expect(deleteResponse.statusCode).toBe(200);
      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.task.id).toBe(1);

      const getResponse = await request(app)
        .get("/api/tasks/1");

      expect(getResponse.statusCode).toBe(404);
    });

    test("DELETE devuelve 404 si el registro no existe", async () => {
      const response = await request(app)
        .delete("/api/tasks/999");

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});