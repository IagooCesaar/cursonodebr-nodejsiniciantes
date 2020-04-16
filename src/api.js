const Hapi = require("hapi");
const MongoDB = require("./db/strategies/mongodb/mongodb");
const HeroiSchema = require("./db/strategies/mongodb/schemas");
const Context = require("./db/strategies/base/contextStrategy");

const HeroRoutes = require("./routes/heroRoutes");

const app = new Hapi.server({
  port: 5000,
});

function mapRoutes(instance, methods) {
  // console.log("Métodos do contexto: " + methods);
  return methods.map((method) => instance[method]());
}

async function main() {
  const connection = MongoDB.connect();
  const context = new Context(new MongoDB(connection, HeroiSchema));

  app.route([...mapRoutes(new HeroRoutes(context), HeroRoutes.methods())]);

  await app.start();
  console.log("Servidor rodando na porta " + app.info.port);

  return app;
}
module.exports = main();
