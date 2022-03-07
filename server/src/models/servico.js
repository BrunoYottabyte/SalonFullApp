const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const servico = new Schema({
  salaoId: {
    type: mongoose.Types.ObjectId,
    ref: "Salao",
    required: true
  },
  titulo: {
    type: String,
    required: true,
  },

  preco: {
    type: Number,
    required: true,
  },
  comissao: {
    type: Number, //% de comissão sobre o preço
    required: true,
  },
  duracao: {
    type: Number, //Duração em minutos
    required: true,
  },
  recorrencia: {
    type: Number, // Período de repetição do serviço em dia
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['A', 'I', 'E'],
    required: true,
    default: 'A'
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Servico", servico);
