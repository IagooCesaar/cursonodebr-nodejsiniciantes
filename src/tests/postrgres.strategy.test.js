const assert = require("assert");
const Postgres = require("../db/strategies/postgres/postgres");
const Context = require("../db/strategies/base/contextStrategy");
const HeroiSchema = require("../db/strategies/postgres/schemas/heroiSchema");

const MOCK_HEROI_CADASTRAR = {
  nome: "Gavião Negro",
  poder: "flechas",
};

const MOCK_HEROI_ATUALIZAR = {
  nome: "Batman",
  poder: "Dinheiro",
};

let context = {};

describe("## Postgres strategy", function () {
  this.timeout(Infinity);

  this.beforeAll(async function () {
    const connection = await Postgres.connect();
    const model = await Postgres.defineModel(connection, HeroiSchema);
    context = new Context(new Postgres(connection, model));

    await context.delete();
    await context.create(MOCK_HEROI_ATUALIZAR);
  });

  it("Deverá conectar ao PostgresSQL", async () => {
    const result = await context.isConnected();
    assert.equal(result, true);
  });

  it("Deverá cadastrar um novo herói", async () => {
    const result = await context.create(MOCK_HEROI_CADASTRAR);
    delete result.id;
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
  });

  it("Deverá retornar um herói que contenha o nome informado", async () => {
    const [result] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome });
    delete result.id;
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
  });

  it("Deverá atualizar o cadastro de apenas um herói pelo seu ID", async () => {
    const [itemAtualizar] = await context.read({
      nome: MOCK_HEROI_ATUALIZAR.nome,
    });
    const novoItem = {
      ...MOCK_HEROI_ATUALIZAR,
      nome: "Homem Morcego",
    };
    // console.log("Novo item ", novoItem);
    const [update] = await context.update(itemAtualizar.id, novoItem);
    const [itemAtualizado] = await context.read({ id: itemAtualizar.id });
    assert.deepEqual(update, 1);
    assert.deepEqual(itemAtualizado.nome, novoItem.nome);
  });

  it("Deverá remover o cadastro de um herói pelo seu ID", async () => {
    const [item] = await context.read({});
    const result = await context.delete(item.id);
    assert.deepEqual(result, 1);
  });
});
