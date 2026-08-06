const request = require("supertest");
const app = require("../app");

describe("Servidor Express", () => {
  test("el healthcheck responde con código HTTP 200", async () => {
    const response = await request(app).get("/api/status");

    expect(response.statusCode).toBe(200);
  });

  test("el healthcheck devuelve el mensaje correcto", async () => {
    const response = await request(app).get("/api/status");

    expect(response.body).toEqual({
      message: "Servidor funcionando correctamente"
    });
  });

  test("el servidor puede iniciar sin errores", (done) => {
    const server = app.listen(0, () => {
      expect(server.listening).toBe(true);

      server.close((error) => {
        done(error);
      });
    });

    server.on("error", done);
  });
});