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
        tags: ["api"],
        description: "Deverá listar os heróis cadastrados",
        notes:
          "Adotará paginação (padrão 10 itens por página) e filtro opcional por nome (consulta like)",
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
              throw boom.internal(error);
          }
        }
      },
    };
  }

  crete() {
    return {
      path: "/herois",
      method: "POST",
      config: {
        tags: ["api"],
        description: "Deverá cadastrar um herói no banco de dados",
        notes: "Deverão ser informados os campos nome e poder",
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
          throw boom.internal(error.message);
        }
      },
    };
  }

  update() {
    return {
      path: "/herois/{id}",
      method: "PATCH",
      config: {
        tags: ["api"],
        description: "Deverá atualizar o cadastrar de um herói pelo seu ID",
        notes:
          "Atualizará o cadastro de um herói quando informado um ID válido",
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
          const dados = JSON.parse(JSON.stringify(payload));

          const result = await this.db.update(id, dados);
          if (result.nModified !== 1)
            return boom.preconditionRequired(
              "Não foi possível atualizar o cadastro de ID informado"
            );

          return {
            message: "Heroi atualizado com sucesso",
          };
        } catch (error) {
          return boom.internal("Internal error");
        }
      },
    };
  }

  delete() {
    return {
      path: "/herois/{id}",
      method: "DELETE",
      config: {
        tags: ["api"],
        description: "Deverá remover o cadastro de um herói do banco de dados",
        notes: "Removerá o cadastro de um herói quando informado um ID válido",
        validate: {
          failAction,
          params: {
            id: Joi.string().required(),
          },
        },
      },
      handler: async (req, h) => {
        try {
          const { id } = req.params;
          const result = await this.db.delete(id);
          if (result.n !== 1)
            return boom.preconditionRequired(
              "Não foi possível remover o cadastro de ID informado"
            );

          return {
            message: "Heroi removido com sucesso",
          };
        } catch (error) {
          return boom.internal("Internal error");
        }
      },
    };
  }
}

module.exports = HeroRoutes;
