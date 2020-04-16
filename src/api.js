const { config } = require("dotenv");
const { join } = require("path");
const { ok } = require("assert");

const env = process.env.NODE_ENV || "dev";
ok(env === "prod" || env === "dev" || env === "test", " A env é inválida");

const configPath = join(__dirname, "..", "config", `.env.${env}`);
config({
  path: configPath,
});

const Hapi = require("hapi");
const HapiSwagger = require("hapi-swagger");
const Vision = require("vision");
const Inert = require("inert");
const HapiJwt = require("hapi-auth-jwt2");

const MongoDB = require("./db/strategies/mongodb/mongodb");
const Postgres = require("./db/strategies/postgres/postgres");

const HeroiSchema = require("./db/strategies/mongodb/schemas");
const UsuarioSchema = require("./db/strategies/postgres/schemas/usuarioSchema");

const Context = require("./db/strategies/base/contextStrategy");

const HeroRoutes = require("./routes/heroRoutes");
const AuthRoutes = require("./routes/authRoutes");

const jwtSecret = process.env.JWT_KEY;

const app = new Hapi.server({
  port: process.env.PORT,
});

function mapRoutes(instance, methods) {
  // console.log("Métodos do contexto: " + methods);
  return methods.map((method) => instance[method]());
}

async function main() {
  const connMongo = await MongoDB.connect();
  const contextMongo = new Context(new MongoDB(connMongo, HeroiSchema));

  const connPG = await Postgres.connect();
  const modelUsuario = await Postgres.defineModel(connPG, UsuarioSchema);
  const contextPG = new Context(new Postgres(connPG, modelUsuario));

  const swaggerOptions = {
    info: {
      title: "API Heróis - #CursoNodeBR",
      version: "v1.0",
    },
    lang: "pt",
  };
  await app.register([
    HapiJwt,
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  app.auth.strategy("jwt", "jwt", {
    key: jwtSecret,
    // options: {
    //   expiresIn: 20,
    // },
    validate: async (dados, request) => {
      //verifica se usuário está ativo
      //verifica se está válido
      const [result] = await contextPG.read({
        username: dados.username.toLowerCase(),
        id: dados.id,
      });
      if (!result)
        return {
          isValid: false,
        };
      return { isValid: true };
    },
  });
  app.auth.default("jwt");

  app.route([
    ...mapRoutes(new HeroRoutes(contextMongo), HeroRoutes.methods()),
    ...mapRoutes(new AuthRoutes(jwtSecret, contextPG), AuthRoutes.methods()),
  ]);

  await app.start();
  console.log("Servidor rodando na porta " + app.info.port);

  return app;
}

module.exports = main();
