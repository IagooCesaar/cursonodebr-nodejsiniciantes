const assert = require("assert");
const api = require("../api");

let app = {};

describe("Suíte de teste de autenticação", function () {
  this.beforeAll(async () => {
    app = await api;
  });

  it("Deverá obter um token", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/login",
      payload: {
        username: "usuario@teste.com.br",
        password: "123",
      },
    });
    // console.log("Resultado geração do token => ", result);
    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 200);
    assert.ok(dados.token.length >= 10);
  });
});
