// yarn add jsonwebtoken
const boom = require("boom");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const BaseRoutes = require("./base/baseRoute");
const PasswordHelper = require("../helpers/passwordHelper");

const failAction = (request, headers, error) => {
  throw error;
};

const ValidUser = {
  username: "usuario@teste.com.br",
  password: "123",
};

class AuthRoutes extends BaseRoutes {
  constructor(criptoKey, db) {
    super();
    this.criptoKey = criptoKey;
    this.db = db;
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
          // if (
          //   username.toLowerCase() !== ValidUser.username ||
          //   password !== ValidUser.password
          // ) {
          //   return boom.unauthorized(
          //     "O usuário e senha fornecido são iválidos"
          //   );
          // }
          const [usuario] = await this.db.read({
            username: username.toLowerCase(),
          });
          if (!usuario)
            return boom.unauthorized(
              "Não foi possível encontrar um usuário com os dados fornecidos"
            );
          const matchPwd = await PasswordHelper.comparePassword(
            password,
            usuario.password
          );

          if (!matchPwd)
            return boom.unauthorized(
              "O usuário ou a senha informada não confere"
            );

          const token = jwt.sign(
            {
              username: usuario.username,
              id: usuario.id,
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
