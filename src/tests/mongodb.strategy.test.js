const assert = require("assert");
const MongoDB = require("../db/strategies/mongodb");
const Context = require("../db/strategies/base/contextStrategy");

const context = new Context(new MongoDB());
const MOCK_HEROI_CADASTRAR = {
  nome: "Gavião Negro",
  poder: "flechas",
};

const MOCK_HEROI_ATUALIZAR = {
  nome: "Batman",
  poder: "Dinheiro",
};

describe("## MongoDB strategy", function () {
  this.timeout(Infinity);

  this.beforeAll(async function () {
    await context.connect();
    await context.delete();
    await context.create(MOCK_HEROI_ATUALIZAR);
  });

  it("Deverá conectar ao MongoDB", async () => {
    const result = await context.isConnected();
    assert.equal(result, true);
  });

  it("Deverá cadastrar um novo herói", async () => {
    const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR);
    assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR);
  });

  it("Deverá retornar um herói que contenha o nome informado", async () => {
    // const result = await context.read({}, 19, 1);
    // console.log("Lista", result);
    const [{ nome, poder }] = await context.read({
      nome: MOCK_HEROI_CADASTRAR.nome,
    });
    assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR);
  });

  it("Deverá atualizar o cadastro de apenas um herói pelo seu ID", async () => {
    const [itemAtualizar] = await context.read({
      nome: MOCK_HEROI_ATUALIZAR.nome,
    });
    const novoItem = {
      ...MOCK_HEROI_ATUALIZAR,
      nome: "Homem Morcego",
    };
    const result = await context.update(itemAtualizar.id, novoItem);
    assert.deepEqual(result.nModified, 1);
  });

  it("Deverá remover o cadastro de um herói pelo seu ID", async () => {
    const [item] = await context.read({});
    // console.log("Será removido o item => ", item);
    const result = await context.delete(item._id);
    // console.log("Qtd registros deletados: " + result.n);
    assert.deepEqual(result.n, 1);
  });
});
