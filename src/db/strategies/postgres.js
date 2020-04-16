const ICrud = require("./interfaces/interfaceCrud");

class Postgres extends ICrud {
  constructor() {
    super();
  }
  create(item) {
    console.log("O item foi salvo no Postgres");
  }
}

module.exports = Postgres;
