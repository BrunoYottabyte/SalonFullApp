const mongoose = require("mongoose");
const schema = mongoose.Schema;

const agendamento = new schema({
  salaoId: {
    type: mongoose.Types.ObjectId,
    ref: "Salao",
    required: true,
  },
  clienteId: {
    type: mongoose.Types.ObjectId,
    ref: "Cliente",
    required: true,
  },
  colaboradorId: {
    type: mongoose.Types.ObjectId,
    ref: "Colaborador",
    required: true,
  },
  servicoId: {
    type: mongoose.Types.ObjectId,
    ref: "Servico",
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
  comissao: {
    type: Number,
    required: true,
  },
  valor: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  pay: Object,
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Agendamento", agendamento);
