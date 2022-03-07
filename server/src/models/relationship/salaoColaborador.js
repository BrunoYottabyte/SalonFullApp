const mongoose = require("mongoose");
const schema = mongoose.Schema;

const salaoColaborador = new schema({
  salaoId: {
    type: mongoose.Types.ObjectId,
    ref: "Salao",
    required: true,
  },
  colaboradorId: {
    type: mongoose.Types.ObjectId,
    ref: "Colaborador",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['A', 'I', 'E'],
    default: 'A'
},
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SalaoColaborador", salaoColaborador);
