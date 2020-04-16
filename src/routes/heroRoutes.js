const boom = require("boom");
const Joi = require("joi");
const BaseRoutes = require("./base/baseRoute");

class HeroRoutes extends BaseRoutes {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: "/herois",
      method: "GET",
      config: {
        validate: {
          /*
           *payload -> body
           *headers -> header
           *params -> na url/:id/...
           *query -> ?skip=0?limit=10
           */
          failAction: (request, headers, error) => {
            throw error;
          },
          query: {
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            nome: Joi.string().min(3).max(100),
          },
        },
      },
      handler: (request, headers) => {
        try {
          const { nome, skip, limit } = request.query;

          const query = nome
            ? {
                nome: { $regex: `.*${nome}*.` },
              }
            : {};

          return this.db.read(query, skip, limit);
        } catch (error) {
          console.log("Deu RUIM", error);
          switch (error.message) {
            case "LIMITE-INVALIDO":
              throw boom.badRequest(
                "O valor informado para o limite não é um número válido"
              );
            case "PULAR-INVALIDO":
              throw boom.badRequest(
                "O valor informado para o skip não é um número válido"
              );
            default:
              throw boom.badImplementation(error);
          }
          return headers.response("Erro interno no servidor").code(500);
        }
      },
    };
  }
}

module.exports = HeroRoutes;
