const boom = require("boom");
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
      handler: (request, headers) => {
        try {
          const { nome, skip, limit } = request.query;

          let query = {};
          if (nome) {
            query.nome = nome;
          }
          if (isNaN(limit) && limit !== undefined)
            throw Error("LIMITE-INVALIDO");
          if (isNaN(skip) && skip !== undefined) throw Error("PULAR-INVALIDO");

          return this.db.read(query, parseInt(skip), parseInt(limit));
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
