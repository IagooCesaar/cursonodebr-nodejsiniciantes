const Sequelize = require("sequelize");

const ICrud = require("../interfaces/interfaceCrud");

class Postgres extends ICrud {
  constructor(connection, schema) {
    super();
    this._conn = connection;
    this._schema = schema;
  }

  static async connect() {
    const connection = new Sequelize(process.env.POSTGRES_URL, {
      host: "localhost",
      // dialect: "postgres",
      quoteIdentifiers: false,
      // operatorsAliases: false,
      ssl: process.env.SSL_DB,
      dialectOptions: {
        ssl: process.env.SSL_DB,
      },
      logging: false,
    });
    return connection;
  }

  static async defineModel(connection, schema) {
    const model = connection.define(schema.name, schema.schema, schema.options);
    await model.sync();
    return model;
  }

  async isConnected() {
    try {
      await this._conn.authenticate();
      return true;
    } catch (error) {
      console.error("Falha ao conectar ao Postgres", error);
      return false;
    }
  }

  async create(item) {
    const { dataValues } = await this._schema.create(item);
    // console.log("O item foi salvo no Postgres");
    return dataValues;
  }

  async read(item = {}) {
    const result = await this._schema.findAll({ where: item, raw: true });
    return result;
  }

  async update(id, item, upsert = false) {
    const fn = upsert ? "upsert" : "update";
    return await this._schema[fn](item, {
      where: {
        id: id,
      },
    });
  }

  async delete(id) {
    const query = id ? { id } : {};
    return await this._schema.destroy({ where: query });
  }
}

module.exports = Postgres;
