// yarn add jsonwebtoken
const boom = require("boom");
const Joi = require("joi");
const BaseRoutes = require("./base/baseRoute");
const jwt = require("jsonwebtoken");

const failAction = (request, headers, error) => {
  throw error;
};

const ValidUser = {
  username: "usuario@teste.com.br",
  password: "123",
};

class AuthRoutes extends BaseRoutes {
  constructor(criptoKey) {
    super();
    this.criptoKey = criptoKey;
  }
  login() {
    return {
      method: "POST",
      path: "/login",
      config: {
        auth: false,
        tags: ["api"],
        description: "Procedimento de login na API",
        notes: "Informe usuário e senha válido",
        validate: {
          failAction,
          payload: {
            username: Joi.string().required().email(),
            password: Joi.string().required().min(3).max(100),
          },
        },
      },
      handler: async (req, h) => {
        try {
          const { username, password } = req.payload;
          if (
            username.toLowerCase() !== ValidUser.username ||
            password !== ValidUser.password
          ) {
            return boom.unauthorized(
              "O usuário e senha fornecido são iválidos"
            );
          }
          const token = jwt.sign(
            {
              username: username,
              id: 0,
            },
            this.criptoKey
          );
          return { token };
        } catch (error) {
          return boom.internal("Erro interno: ", error.message);
        }
      },
    };
  }
}

module.exports = AuthRoutes;
