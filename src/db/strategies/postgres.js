const Sequelize = require("sequelize");

const ICrud = require("./interfaces/interfaceCrud");

class Postgres extends ICrud {
  constructor() {
    super();
    this._driver = null;
    this._herois = null;
  }

  async connect() {
    this._driver = new Sequelize("heroes", "sysdba", "masterkey", {
      host: "localhost",
      dialect: "postgres",
      quoteIdentifiers: false,
      operatorsAliases: false,
    });
    await this._defineModel();
  }

  async _defineModel() {
    this._herois = this._driver.define(
      "herois",
      {
        id: {
          type: Sequelize.INTEGER,
          required: true,
          primaryKey: true,
          autoIncrement: true,
        },
        nome: {
          type: Sequelize.STRING,
          required: true,
        },
        poder: {
          type: Sequelize.STRING,
          require: true,
        },
      },
      {
        tableName: "TB_HEROIS",
        freezeTableName: false,
        timestamps: false,
      }
    );
    await this._herois.sync();
  }

  async isConnected() {
    try {
      await this._driver.authenticate();
      return true;
    } catch (error) {
      console.error("Falha ao conectar ao Postgres", error);
      return false;
    }
  }

  async create(item) {
    const { dataValues } = await this._herois.create(item);
    console.log("O item foi salvo no Postgres");
    return dataValues;
  }

  async read(item = {}) {
    const result = await this._herois.findAll({ where: item, raw: true });
    return result;
  }

  async update(id, item) {
    return await this._herois.update(item, {
      where: {
        id: id,
      },
    });
  }

  async delete(id) {
    const query = id ? { id } : {};
    return await this._herois.destroy({ where: query });
  }
}

module.exports = Postgres;
