const assert = require("assert");
const api = require("../api");
let app = {};

const MOCK_HEROI_CADASTRAR = {
  nome: "Superman",
  poder: "Super Força",
};

describe.only("## Suíte de testes da API Heroes", function () {
  this.beforeAll(async () => {
    app = await api;
  });

  it("Deverá listar os heróis cadastrados", async () => {
    const result = await app.inject({
      method: "GET",
      url: "/herois",
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(dados));
  });

  it("Deverá retornar uma lista reduzida de heróis utilizando filtros (no máx 10 itens)", async () => {
    const LIMITE = 10;
    const result = await app.inject({
      method: "GET",
      url: `/herois?skip=0&limit=${LIMITE}`,
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.ok(dados.length <= LIMITE);
  });

  it("Não deverá retornar heróis por erro interno", async () => {
    const LIMITE = "AAA";
    const result = await app.inject({
      method: "GET",
      url: `/herois?skip=0&limit=${LIMITE}`,
    });
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 400);
  });

  it("Deverá retornar Heróis que contenham o nome Gavião Negro", async () => {
    const nome = "Gavião Negro";
    const result = await app.inject({
      method: "GET",
      url: `/herois?skip=0&limit=10&nome=${nome}`,
    });
    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.ok(dados.length >= 1);
  });

  it.only("Cadastrar um novo herói", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/herois",
      payload: MOCK_HEROI_CADASTRAR,
    });
    const { _id } = JSON.parse(result.payload);
    assert.ok(result.statusCode === 200);
    // assert.notStrictEqual(_id, undefined);
    assert.ok((result.payload.message = "Heroi cadastrado com sucesso"));
  });
});
