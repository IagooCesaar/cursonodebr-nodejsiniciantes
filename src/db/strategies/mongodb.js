const ICrud = require("./interfaces/interfaceCrud");

class MongoDB extends ICrud {
  constructor() {
    super();
  }
  create(item) {
    console.log("O item foi salvo no MongoDB");
  }
}

module.exports = MongoDB;
