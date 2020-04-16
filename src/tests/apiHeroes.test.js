const assert = require("assert");
const api = require("../api");
let app = {};

describe("## Suíte de testes da API Heroes", function () {
  this.beforeAll(async () => {
    app = await api;
  });
  it("Deverá listar os heróis cadastrados", async () => {
    const result = await app.inject({
      method: "GET",
      url: "/heroes",
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(dados));
    console.log(result);
  });
});
