const mongoose = require("mongoose");
const schema = mongoose.Schema;

const salaoCliente = new schema({
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

module.exports = mongoose.model("SalaoCliente", salaoCliente);
