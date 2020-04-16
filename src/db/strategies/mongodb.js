const ICrud = require("./interfaces/interfaceCrud");

const mongoose = require("mongoose");

class MongoDB extends ICrud {
  constructor() {
    super();
    this._herois = null;
    this._driver = null;
    this._model = null;
    this._conn = null;
  }

  async connect() {
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
    this._conn = mongoose.connection;
    this._conn.once("open", () => {
      console.log("Conexão MongoDB estabelecida");
    });
    await this._defineModel();
  }

  async _defineModel() {
    this._model = new mongoose.Schema({
      nome: {
        type: String,
        required: true,
      },
      poder: {
        type: String,
        required: true,
      },
      insertAt: {
        type: Date,
        default: new Date(),
      },
    });

    this._herois = mongoose.model("herois", this._model);
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
    const result = await this._herois.create(item);
    //console.log("O item foi salvo no MongoDB: ", result);
    return result;
  }

  async read(item = {}, skip = 0, limit = 10) {
    const result = await this._herois.find(item).skip(skip).limit(limit);
    return result;
  }

  async update(id, item) {
    return await this._herois.updateOne({ _id: id }, { $set: item });
  }

  async delete(id) {
    let response = null;
    id
      ? (response = await this._herois.deleteOne({ _id: id }, (err) => {
          if (err) console.error(`Erro ao deletar item ${id} => `, err);
        }))
      : (response = await this._herois.deleteMany({}, (err) => {
          if (err) console.error("Erro ao deletar muitos => ", err);
        }));
    return response;
  }
}

module.exports = MongoDB;
