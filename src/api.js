// yarn add vision inert hapi-swagger@9.1.3

const Hapi = require("hapi");
const MongoDB = require("./db/strategies/mongodb/mongodb");
const HeroiSchema = require("./db/strategies/mongodb/schemas");
const Context = require("./db/strategies/base/contextStrategy");

const HapiSwagger = require("hapi-swagger");
const Vision = require("vision");
const Inert = require("inert");

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
  const swaggerOptions = {
    info: {
      title: "API Heróis - #CursoNodeBR",
      version: "v1.0",
    },
    lang: "pt",
  };
  await app.register([
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  app.route(mapRoutes(new HeroRoutes(context), HeroRoutes.methods()));

  await app.start();
  console.log("Servidor rodando na porta " + app.info.port);

  return app;
}
module.exports = main();
