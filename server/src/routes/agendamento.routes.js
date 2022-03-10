const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const pagarme = require("../services/pagarme");
const Cliente = require("../models/cliente");
const Salao = require("../models/salao");
const Servico = require("../models/servico");
const Colaborador = require("../models/colaborador");
const Agendamento = require("../models/agendamento");
const util = require("../util");
const keys = require("../data/keys.json");
const moment = require('moment') //lib que trabalha com horas

//rotas
router.post("/", async (req, res) => {
  const db = mongoose.connection;
  const session = await db.startSession();
  session.startTransaction();
  try {
    const { clienteId, salaoId, servicoId, colaboradorId } = req.body;
    /* FAZER VERIFICAÇÃO SE AINDA EXISTE AQUELE HORÁRIO DISPONÍVEL */

    //RECUPERAR O CLIENTE
    const cliente = await Cliente.findById(clienteId).select(
      "nome endereco customerId"
    );
    //RECUPERAR O SALAO
    const salao = await Salao.findById(salaoId).select("recipientId");
    //RECUPERAR O SERVICO
    const servico = await Servico.findById(servicoId).select(
      "preco titulo comissao"
    );
    //RECUPERAR O COLABORADOR
    const colaborador = await Colaborador.findById(colaboradorId).select(
      "recipientId"
    );
    //CRIANDO PAGAMENTO
    const precoFinal = util.toCents(servico.preco) * 100; /// 49.90 => 4990 centavos
    //COLABORADOR SPLIT RULES
    const colaboradorSplitRule = {
      amount: parseInt(precoFinal * (servico.comissao / 100)),
      type: "flat",
      recipient_id: colaborador.recipientId,
    };

    const createPayment = await pagarme("orders", {
      //items comprado
      items: [
        {
          id: servicoId,
          amount: precoFinal,
          description: servico.titulo,
          quantity: 1,
          status: "active",
            code:"abc"
        },
      ],
      //dados do cliente
      customer_id: cliente.customerId,
      code: cliente.customerId,
      antifraud:{
        type:"clearsale",
        clearsale:{
            custom_sla:"90"
        }
    },
    session_id: "322b821a",
    device: {
        "platform": "ANDROID OS"
    },
    ip: "52.168.67.32",
    location: {
        latitude: "-22.970722",
        longitude: "43.182365"
    },
      payments: [
        {
          payment_method: "credit_card",
          credit_card: {
            recurrence: false,
            installments: 1,
            statement_descriptor: "AVENGERS",
            card_id: "card_ZPEv5G5CpnH35l0j",
            card: {
              number: "4000000000000010",
              holder_name: "Tony Stark",
              exp_month: 1,
              exp_year: 30,
              cvv: "3531",
              brand: "Visa",
              billing_address: {
                line_1: cliente.endereco.rua,
                line_2: cliente.endereco.complementar,
                zip_code: cliente.endereco.cep,
                city: cliente.endereco.cidade,
                state: cliente.endereco.uf,
                country: cliente.endereco.pais,
              },
            },
          },
          split: [
            //TAXA DO SALAO
            {
              amount: precoFinal - keys.app_fee - colaboradorSplitRule.amount,
              recipient_id: salao.recipientId,
              type: "flat",
            },
            //TAXA DO COLABORADOR
            colaboradorSplitRule,
            //TAXA DO APP
            {
              type: "flat",
              amount: keys.app_fee,
              recipient_id: keys.recipientId,
            },
          ],
        },
      ],
    });

    if (createPayment.error) {
      throw createPayment;
    }
    const agendamento = await new Agendamento({
      ...req.body,
      transactionId: createPayment.data.data.id,
      comissao: servico.comissao,
      valor: servico.preco,
    }).save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ error: false, agendamento });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message});
  }
});

router.post('/filter', async(req, res) => {
  try{
    const { periodo, salaoId} = req.body;
    const agendamento = await Agendamento.find({
      salaoId,
      data: {
        $gte: moment(periodo.inicio).startOf('day'), //maior ou igual
        $lte: moment(periodo.final).endOf('day') // menor ou igual
      }
    }).populate([
      {path: 'servicoId', select: 'titulo duracao'},
      {path: 'colaboradorId', select: 'nome'},
      {path: 'clienteId', select: 'nome'},
    ]).select('servicoId colaboradorId clienteId -_id');

    res.json({error: false, agendamento})
  }catch(err){
    res.json({error: true, message: err.message})
  }
})

module.exports = (app) => app.use("/agendamento", router);
