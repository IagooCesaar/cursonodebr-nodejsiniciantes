const boom = require("boom");
const Joi = require("joi");
const BaseRoutes = require("./base/baseRoute");

const failAction = (request, headers, error) => {
  throw error;
};

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
          failAction: failAction,
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
          console.error("Deu RUIM", error);
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

  crete() {
    return {
      path: "/herois",
      method: "POST",
      config: {
        validate: {
          failAction,
          payload: {
            nome: Joi.string().required().min(3).max(100),
            poder: Joi.string().required().min(3).max(30),
          },
        },
      },
      handler: async (request, headers) => {
        try {
          const { nome, poder } = request.payload;
          const result = await this.db.create({ nome, poder });

          return { message: "Heroi cadastrado com sucesso", _id: result._id };
        } catch (error) {
          console.error("Deu RUIM ==> ", error);
          throw boom.badImplementation("Internal error");
        }
      },
    };
  }

  update() {
    return {
      path: "/herois/{id}",
      method: "PATCH",
      config: {
        validate: {
          failAction,
          params: {
            id: Joi.string().required(),
          },
          payload: {
            nome: Joi.string().min(3).max(100),
            poder: Joi.string().min(3).max(30),
          },
        },
      },
      handler: async (request, headers) => {
        try {
          const { id } = request.params;
          const { payload } = request;
          console.log("Payload ==> ", payload);
          const dados = JSON.parse(JSON.stringify(payload));

          const result = await this.db.update(id, dados);
          console.log("Result", result);
          if (result.nModified !== 1)
            return boom.expectationFailed(
              "Não foi possível atualizar o cadastro de ID informado"
            );

          return {
            message: "Heroi atualizado com sucesso",
          };
        } catch (error) {
          console.error("Deu RUIM", error);
          return boom.badImplementation("Internal error");
        }
      },
    };
  }
}

module.exports = HeroRoutes;
