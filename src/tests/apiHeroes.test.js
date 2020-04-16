const assert = require("assert");
const api = require("../api");
let app = {};

const MOCK_HEROI_GAVIAO = {
  nome: "Gavião Negro",
  poder: "Flechas",
};

const MOCK_HEROI_CADASTRAR = {
  nome: "Superman",
  poder: "Super Força",
};

const MOCK_HEROI_INICIAL = {
  nome: "Arqueiro Verde",
  poder: "Pontaria",
};

let MOCK_ID = "";

const validToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzdWFyaW9AdGVzdGUuY29tLmJyIiwiaWQiOjEsImlhdCI6MTU4Njk1MzgxNH0.q_RRiLN2xPC-K4NzIgN3WxSbAHnawWqCTpZtc7G2phA";

const headers = {
  authorization: validToken,
};

describe("## Suíte de testes da API Heroes", function () {
  this.timeout(Infinity);

  this.beforeAll(async () => {
    app = await api;
    // console.log("Instaciado o app ...");

    await app.inject({
      headers,
      method: "POST",
      url: "/herois",
      payload: MOCK_HEROI_GAVIAO,
    });
    // console.log("Cadastrado MOCK_HEROI_GAVIAO ...");

    const result = await app.inject({
      headers,
      method: "POST",
      url: "/herois",
      payload: MOCK_HEROI_INICIAL,
    });
    // console.log("Cadastrado MOCK_HEROI_INICIAL ...");

    const dados = JSON.parse(result.payload);
    MOCK_ID = dados._id;
    // console.log("Retornado ID válido do MOCK_HEROI_INICIAL ...");
  });

  it("Deverá listar os heróis cadastrados", async () => {
    const result = await app.inject({
      headers,
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
      headers,
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
      headers,
      method: "GET",
      url: `/herois?skip=0&limit=${LIMITE}`,
    });
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 400);
  });

  it("Deverá retornar Heróis que contenham o nome Gavião Negro", async () => {
    const nome = "Gavião Negro";
    const result = await app.inject({
      headers,
      method: "GET",
      url: `/herois?skip=0&limit=10&nome=${nome}`,
    });
    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.ok(dados.length >= 1);
  });

  it("Cadastrar um novo herói", async () => {
    const result = await app.inject({
      headers,
      method: "POST",
      url: "/herois",
      payload: MOCK_HEROI_CADASTRAR,
    });

    assert.ok(result.statusCode === 200);
    assert.ok((result.payload.message = "Heroi cadastrado com sucesso"));
  });

  it("Deverá atualizar o cadastrar de um herói", async () => {
    const expected = {
      poder: "Super pontaria",
    };
    const result = await app.inject({
      headers,
      method: "PATCH",
      url: `/herois/${MOCK_ID}`,
      payload: expected,
    });
    const dados = JSON.parse(result.payload);

    assert.ok(result.statusCode === 200);
    assert.deepEqual(dados.message, "Heroi atualizado com sucesso");
  });

  it("Não deverá atualizar o cadastrar de um herói com ID incorreto", async () => {
    const expected = {
      poder: "Erro na atualização",
    };
    const result = await app.inject({
      headers,
      method: "PATCH",
      url: "/herois/5e94d2f78da4c306447c707d",
      payload: expected,
    });
    const dados = JSON.parse(result.payload);
    const expectedError = {
      statusCode: 428,
      error: "Precondition Required",
      message: "Não foi possível atualizar o cadastro de ID informado",
    };
    assert.ok(result.statusCode === 428);
    assert.deepEqual(dados, expectedError);
  });

  it("Deverá apagar o cadastro de um herói", async () => {
    const result = await app.inject({
      headers,
      method: "DELETE",
      url: `/herois/${MOCK_ID}`,
    });

    const dados = JSON.parse(result.payload);

    assert.ok(result.statusCode === 200);
    assert.deepEqual(dados.message, "Heroi removido com sucesso");
  });

  it("Não deverá apagar o cadastro de um herói com ID incorreto", async () => {
    const result = await app.inject({
      headers,
      method: "DELETE",
      url: "/herois/5e94d2f78da4c306447c707d",
    });

    const dados = JSON.parse(result.payload);
    const expectedError = {
      statusCode: 428,
      error: "Precondition Required",
      message: "Não foi possível remover o cadastro de ID informado",
    };

    assert.deepEqual(dados, expectedError);
  });

  it("Não deverá apagar o cadastro de um herói com ID inválido", async () => {
    const result = await app.inject({
      headers,
      method: "DELETE",
      url: "/herois/ID_INVALIDO",
    });

    const dados = JSON.parse(result.payload);
    const expectedError = {
      statusCode: 500,
      error: "Internal Server Error",
      message: "An internal server error occurred",
    };

    assert.deepEqual(dados, expectedError);
  });
});
