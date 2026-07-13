const request = require("supertest");
const app = require("../app");

describe("Servidor Express", () => {
  test("la ruta principal responde con código HTTP 200", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
  });

  test("la ruta principal devuelve el mensaje correcto", async () => {
    const response = await request(app).get("/");

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