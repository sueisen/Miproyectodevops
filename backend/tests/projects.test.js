const request = require("supertest");
const app = require("../app");
const mockDataService = require("../services/mockData.service");

describe("CRUD de proyectos", () => {
  beforeEach(() => {
    mockDataService._resetStores();
  });

  describe("POST /api/projects", () => {
    test("crea un proyecto y responde con código 201", async () => {
      const response = await request(app)
        .post("/api/projects")
        .send({ name: "Proyecto A", description: "Descripción A" });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.project).toMatchObject({
        name: "Proyecto A",
        description: "Descripción A"
      });
    });

    test("responde 400 si falta el nombre", async () => {
      const response = await request(app)
        .post("/api/projects")
        .send({ description: "Sin nombre" });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/projects", () => {
    test("responde con la lista de proyectos creados", async () => {
      await request(app).post("/api/projects").send({ name: "Proyecto A" });
      await request(app).post("/api/projects").send({ name: "Proyecto B" });

      const response = await request(app).get("/api/projects");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.projects).toHaveLength(2);
    });

    test("responde con lista vacía si no hay proyectos", async () => {
      const response = await request(app).get("/api/projects");

      expect(response.statusCode).toBe(200);
      expect(response.body.projects).toEqual([]);
    });
  });

  describe("GET /api/projects/:projectId", () => {
    test("responde con el proyecto solicitado", async () => {
      const created = await request(app)
        .post("/api/projects")
        .send({ name: "Proyecto A" });

      const response = await request(app).get(
        `/api/projects/${created.body.project.id}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.project.name).toBe("Proyecto A");
    });

    test("responde 404 si el proyecto no existe", async () => {
      const response = await request(app).get("/api/projects/999");

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/projects/:projectId", () => {
    test("edita el proyecto y responde con código 200", async () => {
      const created = await request(app)
        .post("/api/projects")
        .send({ name: "Proyecto A", description: "Original" });

      const response = await request(app)
        .put(`/api/projects/${created.body.project.id}`)
        .send({ name: "Proyecto A editado", description: "Nueva descripción" });

      expect(response.statusCode).toBe(200);
      expect(response.body.project).toMatchObject({
        name: "Proyecto A editado",
        description: "Nueva descripción"
      });
    });

    test("responde 400 si el nombre viene vacío", async () => {
      const created = await request(app)
        .post("/api/projects")
        .send({ name: "Proyecto A" });

      const response = await request(app)
        .put(`/api/projects/${created.body.project.id}`)
        .send({ name: "   " });

      expect(response.statusCode).toBe(400);
    });

    test("responde 404 si el proyecto no existe", async () => {
      const response = await request(app)
        .put("/api/projects/999")
        .send({ name: "No existe" });

      expect(response.statusCode).toBe(404);
    });
  });

  describe("DELETE /api/projects/:projectId", () => {
    test("elimina el proyecto y responde con código 200", async () => {
      const created = await request(app)
        .post("/api/projects")
        .send({ name: "Proyecto A" });

      const response = await request(app).delete(
        `/api/projects/${created.body.project.id}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      const getResponse = await request(app).get(
        `/api/projects/${created.body.project.id}`
      );
      expect(getResponse.statusCode).toBe(404);
    });

    test("responde 404 si el proyecto no existe", async () => {
      const response = await request(app).delete("/api/projects/999");

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});