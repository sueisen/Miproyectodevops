const express = require("express");
const asignacionRoutes = require("./routers/asignacionRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", asignacionRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Servidor funcionando correctamente"
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  });
}

module.exports = app;