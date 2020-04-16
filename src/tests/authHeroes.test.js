const assert = require("assert");
const api = require("../api");

const Context = require("../db/strategies/base/contextStrategy");
const Postgres = require("../db/strategies/postgres/postgres");
const UsuarioSchema = require("../db/strategies/postgres/schemas/usuarioSchema");

const USER = {
  username: "usuario@teste.com.br",
  password: "123",
};
const USER_DB = {
  ...USER,
  password: "$2b$04$4lxqM3x4auYuxZCyugXpWuzPxlPoX0YQxcEn3nbYmQbvMc6FDhcWq",
};

let app = {};

describe("## Suíte de teste de autenticação", function () {
  this.beforeAll(async () => {
    app = await api;
    const connPG = await Postgres.connect();
    const modelUsuario = await Postgres.defineModel(connPG, UsuarioSchema);
    const contextPG = new Context(new Postgres(connPG, modelUsuario));
    await contextPG.update(null, USER_DB, true); //Inserir ou atualizar USER_DB
  });

  it("Deverá obter um token", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/login",
      payload: USER,
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);
    // console.log("Token válido ==> ", dados);

    assert.deepEqual(statusCode, 200);
  });

  it("NÃO deverá obter um token por usuario inválido", async () => {
    const USER_ERROR = {
      ...USER,
      username: "usuario2@teste.com.br",
    };
    const result = await app.inject({
      method: "POST",
      url: "/login",
      payload: USER_ERROR,
    });
    const dados = JSON.parse(result.payload);
    const expected = {
      statusCode: 401,
      error: "Unauthorized",
      message: "Não foi possível encontrar um usuário com os dados fornecidos",
    };

    assert.deepEqual(dados, expected);
  });

  it("NÃO deverá obter um token por senha inválida", async () => {
    const USER_ERROR = {
      ...USER,
      password: "123456",
    };
    const result = await app.inject({
      method: "POST",
      url: "/login",
      payload: USER_ERROR,
    });
    const dados = JSON.parse(result.payload);
    const expected = {
      statusCode: 401,
      error: "Unauthorized",
      message: "O usuário ou a senha informada não confere",
    };

    assert.deepEqual(dados, expected);
  });
});
