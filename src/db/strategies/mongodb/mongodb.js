const ICrud = require("../interfaces/interfaceCrud");

const mongoose = require("mongoose");

class MongoDB extends ICrud {
  constructor(connection, schema) {
    super();
    this._model = null;
    this._schema = schema;
    this._conn = connection;
  }

  static connect() {
    mongoose.connect(
      "mongodb://admin:admin@localhost:27017/herois?authSource=admin&readPreference=primary",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      function (error) {
        if (!error) return;
        console.error("Falha na conexão =>", error);
      }
    );
    const connection = mongoose.connection;
    connection.once("open", () => {
      console.log("Conexão MongoDB estabelecida");
    });
    return connection;
  }

  async isConnected() {
    const state = this._conn.readyState;
    const STATUS = {
      0: "Disconectado",
      1: "Conectado",
      2: "Conectando",
      3: "Disconectando",
    };
    if (state === 1) return true;
    if (!state === 2) return false;

    await new Promise((resolve) => setTimeout(resolve, 1000)); //aguardar 1 segundo
    return this._conn.readyState === 1;
  }

  async create(item) {
    const result = await this._schema.create(item);
    //console.log("O item foi salvo no MongoDB: ", result);
    return result;
  }

  async read(item = {}, skip = 0, limit = 10) {
    const result = await this._schema.find(item).skip(skip).limit(limit);
    return result;
  }

  async update(id, item) {
    return await this._schema.updateOne({ _id: id }, { $set: item });
  }

  async delete(id) {
    let response = null;
    id
      ? (response = await this._schema.deleteOne({ _id: id }))
      : (response = await this._schema.deleteMany({}));
    return response;
  }
}

module.exports = MongoDB;
