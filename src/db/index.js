const ContextStrategy = require("./strategies/base/contextStrategy");
const MongoDB = require("./strategies/mongodb/mongodb");
const Postgres = require("./strategies/postgres");

const contextMongo = new ContextStrategy(new MongoDB());
const contextPostgres = new ContextStrategy(new Postgres());

module.exports = {
  contextMongo,
  contextPostgres,
};
