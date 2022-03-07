const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colaborador = new Schema({
  nome: {
    type: String,
    required: [true, "Nome é obrigatório"],
  },
  foto: String,
  email: {
    type: String,
    required: [true, "E-mail é obrigatório."],
  },
  senha: {
    type: String,
    default: null,
  },
  telefone: String,
  // endereco: {
  //     cidade: String,
  //     uf: String,
  //     cep: String,
  //     numero: String,
  //     pais: String
  // },
  dataNascimento: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  sexo: {
    type: String,
    enum: ["M", "F"],
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["A", "I"],
    default: "A",
  },
  pessoa: {
    type: String,
    enum: ["individual", "company"],
    required: true,
    default: "F",
  },
  contaBancaria: {
    titular: {
      type: String,
      required: true,
    },
    cpfCnpj: {
      type: String,
      required: true,
    },
    banco: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      enum: ["checking", "savings"],
      required: true,
    },
    agencia: {
      type: String,
      required: true,
    },
    numero: {
      type: String,
      required: true,
    },
    dv: {
      type: String,
      required: true,
    },
  },
  recipientId: {
    type: String,
    // required: true,
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Colaborador", colaborador);
