const mongoose = require("mongoose");

mongoose.connect(
  // "mongodb://admin:admin@localhost:27017/herois?retryWrites=true&w=majority",
  // "mongodb+srv://admin:admin@localhost:27017/herois?retryWrites=true&w=majority",
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

const conn = mongoose.connection;
conn.once("open", () => {
  console.log("Conexão MongoDB estabelecida");
});
const state = conn.readyState;
console.log("state ", state);
/*
  *Estados da conexão:
  0: Disconectado
  1: Conectado
  2: Conectando
  3: Disconectando
*/

const heroiSchema = new mongoose.Schema({
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

const model = mongoose.model("herois", heroiSchema);

async function main() {
  const resultCadastrar = await model.create({
    nome: "Batman",
    poder: "Dinheiro",
  });
  console.log("Resultado ", resultCadastrar);

  const listItem = await model.find();
  console.log("Itens cadastrados ", listItem);
}
main();
