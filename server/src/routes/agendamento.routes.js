const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const pagarme = require("../services/pagarme");
const Cliente = require("../models/cliente");
const Salao = require("../models/salao");
const Servico = require("../models/servico");
const Colaborador = require("../models/colaborador");
const Horario = require("../models/horario");
const Agendamento = require("../models/agendamento");
const util = require("../util");
const keys = require("../data/keys.json");
const moment = require("moment"); //lib que trabalha com horas

const _ = require("lodash");

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
          code: "abc",
        },
      ],
      //dados do cliente
      customer_id: cliente.customerId,
      code: cliente.customerId,
      antifraud: {
        type: "clearsale",
        clearsale: {
          custom_sla: "90",
        },
      },
      session_id: "322b821a",
      device: {
        platform: "ANDROID OS",
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
              options: {
                charge_processing_fee: true,
                charge_remainder_fee: true,
                liable: true,
              },
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
      pay: createPayment.data.data.charges,
    }).save({ session });
    await session.commitTransaction();
    session.endSession();

    res.json({ error: false, agendamento });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
});

router.post("/filter", async (req, res) => {
  try {
    const { periodo, salaoId } = req.body;
    const agendamento = await Agendamento.find({
      salaoId,
      data: {
        $gte: moment(periodo.inicio).startOf("day"), //maior ou igual
        $lte: moment(periodo.final).endOf("day"), // menor ou igual
      },
    })
      .populate([
        { path: "servicoId", select: "titulo duracao" },
        { path: "colaboradorId", select: "nome" },
        { path: "clienteId", select: "nome" },
      ])
      .select("servicoId colaboradorId clienteId pay data -_id");

    res.json({ error: false, agendamento });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.post("/dias-disponiveis", async (req, res) => {
  try {
    const { data, salaoId, servicoId } = req.body;
    const horarios = await Horario.find({ salaoId });
    const servico = await Servico.findById(servicoId).select("duracao");

    let agenda = [];
    let colaboradores = [];
    let lastDay = moment(data);

    //DURACAO DO SERVICO;

    const servicoMinutos = util.hourToMinutes(
      moment(servico.duracao).format("HH:mm")
    );

    const servicoSlots = util.sliceMinutes(
      servico.duracao,
      moment(servico.duracao).add(servicoMinutos, "minutes"),
      util.SLOT_DURATION
    ).length;

    /*Procure nos próximos 365 dias até a agenda ter 7 dias disponíveis*/
    for (let i = 0; i <= 365 && agenda.length <= 7; i++) {
      const espacosValidos = horarios.filter((h) => {
        //Verificar o dia da semana
        const diaSemanaDisponivel = h.dias.includes(moment(lastDay).day()); //0 - 6

        // VERIFICAR ESPECIALIDADE DISPONÍVEL
        const servicoDisponivel = h.especialidades.includes(servicoId);

        return diaSemanaDisponivel && servicoDisponivel;
      });

      if (espacosValidos.length > 0) {
        let todosHorariosDia = {};

        for (let espaco of espacosValidos) {
          for (let colaboradorId of espaco.colaboradores) {
            if (!todosHorariosDia[colaboradorId]) {
              todosHorariosDia[colaboradorId] = [];
            }

            //pegar todos os espaços e por dentro do horario do colaborador

            todosHorariosDia[colaboradorId] = [
              ...todosHorariosDia[colaboradorId],
              ...util.sliceMinutes(
                util.mergeDateTime(lastDay, espaco.inicio),
                util.mergeDateTime(lastDay, espaco.fim),
                util.SLOT_DURATION
              ),
            ];
          }
        }

        //OCUPACAO DE CADA ESPECIALISTA NO DIA
        for (let colaboradorId of Object.keys(todosHorariosDia)) {
          //Recuperar agendamentos
          const agendamento = await Agendamento.find({
            colaboradorId,
            data: {
              $gte: moment(lastDay).startOf("day"),
              $lte: moment(lastDay).endOf("day"),
            },
          })
            .select("data servicoId -_id")
            .populate("servicoId", "duracao");

          //Recuperar horarios agendados

          let horariosOcupados = agendamento.map((agendamento) => ({
            inicio: moment(agendamento.data),
            final: moment(agendamento.data).add(
              util.hourToMinutes(
                moment(agendamento.servicoId.duracao).format("HH:mm")
              ),
              "minutes"
            ),
          }));

          horariosOcupados = horariosOcupados
            .map((h) =>
              util.sliceMinutes(h.inicio, h.final, util.SLOT_DURATION)
            )
            .flat();

          //removendo TODOS OS HORARIOS / SLOTS OCUPADOS

          todosHorariosDia[colaboradorId] = util
            .splitByValue(
              todosHorariosDia[colaboradorId].map((horarioLivre) => {
                return horariosOcupados.includes(horarioLivre)
                  ? "-"
                  : horarioLivre;
              }),
              "-"
            )
            .filter((space) => space.length > 0);
          // .flat();

          //VERIFICANDO SE EXISTE ESPAÇO SUFICIENTE NO SLOT;
          let horariosLivres = todosHorariosDia[colaboradorId].filter(
            (horarios) => horarios.length >= servicoSlots
          );

          /*VERIFIANDO SE OS HORÁRIOS DENTRO DO SLOT TEM A CONTINUIDADE NECESSÁRIA */
          horariosLivres = horariosLivres
            .map((slot) =>
              slot.filter(
                (horario, index) => slot.length - index >= servicoSlots
              )
            )
            .flat();
          //FORMATANDO HORARIO DE 2 EM 2
          horariosLivres = _.chunk(horariosLivres, 2);
          //REMOVER COLABORADOR CASO NÃO HAJA NENHUM ESPAÇO
          if (horariosLivres.length === 0) {
            todosHorariosDia = _.omit(todosHorariosDia, colaboradorId);
          } else {
            todosHorariosDia[colaboradorId] = horariosLivres;
          }
        }
        //VERIFICAR SE TEM ESPECIALISTA DISPONIVEL NAQUELE DIA
        const totalEspecialistas = Object.keys(todosHorariosDia).length;
        if (totalEspecialistas > 0) {
          colaboradores.push(Object.keys(todosHorariosDia));
          agenda.push({
            [moment(lastDay).format("YYYY-MM-DD")]: todosHorariosDia,
          });
        }
      }

      lastDay = moment(lastDay).add(1, "day");
    }
    //RECUPERANDO DADOS DO COLABORADOR
    colaboradores = colaboradores.flat();

    colaboradores = await Colaborador.find({
      _id: { $in: colaboradores },
    }).select("nome foto");

    colaboradores = colaboradores.map((c) => ({
      ...c._doc,
      nome: c.nome.split(" ")[0],
    }));

    console.log(colaboradores);

    /* TODOS OS COLABORADORES DISPONÍVEIS NO DIA E SEUS HORARIOS */

    res.json({
      error: false,
      colaboradores: _.uniq(colaboradores),
      agenda,
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = (app) => app.use("/agendamento", router);
