const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Colaborador = require("../models/colaborador");
const SalaoColaborador = require("../models/relationship/salaoColaborador");
const ColaboradorServico = require("../models/relationship/colaboradorServico");
const pagarme = require("../services/pagarme");

router.post("/", async (req, res) => {
  const db = mongoose.connection;
  const session = await db.startSession();
  session.startTransaction();
  try {
    const { colaborador, salaoId } = req.body;
    let newColaborador = null;
    //verificar se o colaborador existe
    const existentColaborador = await Colaborador.findOne({
      $or: [{ email: colaborador.email }, { telefone: colaborador.telefone }],
    });

    //Relacionamento

    if (!existentColaborador) {
      //criar conta bancaria
      const { contaBancaria } = colaborador;
      const pagarmeBankAccount = await pagarme("recipients", {
        name: colaborador.nome,
        email: colaborador.email,
        description: "Recebedor tony stark",
        document: contaBancaria.cpfCnpj,
        type: "individual",
        default_bank_account: {
          holder_name: contaBancaria.titular,
          holder_type: "individual",
          holder_document: contaBancaria.cpfCnpj,
          bank: contaBancaria.banco,
          branch_number: contaBancaria.agencia,
          branch_check_digit: "6",
          account_number: contaBancaria.numero,
          account_check_digit: contaBancaria.dv,
          type: contaBancaria.tipo,
        },

        ///criar recebedor
        transfer_settings: {
          transfer_enabled: true,
          transfer_interval: "Daily",
          transfer_day: 0,
        },
        automatic_anticipation_settings: {
          enabled: true,
          type: "full",
          volume_percentage: "50",
          delay: null,
        },
      });
      if (pagarmeBankAccount.error) {
        throw pagarmeBankAccount;
      }

      //Criando colaborador
      newColaborador = await Colaborador({
        ...colaborador,
        recipientId: pagarmeBankAccount.data.id,
      }).save({ session });
    }

    const colaboradorId = existentColaborador
      ? existentColaborador._id
      : newColaborador._id;

    //Verifica se ja existe o relacionamento com o salão
    const existentRelationShip = await SalaoColaborador.findOne({
      salaoId,
      colaboradorId,
      status: { $ne: "E" },
    });

    //SE NAO ESTÁ VINCULADO
    if (!existentRelationShip) {
      await new SalaoColaborador({
        salaoId,
        colaboradorId,
        status: colaborador.vinculo,
      }).save({ session });
    }

    //SE JÁ EXISTIR UM VINCULO ENTRE COLABORADOR E SALAO
    if (existentColaborador) {
      await SalaoColaborador.findOneAndUpdate(
        {
          salaoId,
          colaboradorId,
        },
        { status: colaborador.vinculo },
        { session }
      );
    }

    //RELAÇÃO COM AS ESPECIALIDADES
    await ColaboradorServico.insertMany(
      colaborador.especialidades.map(
        (servicoId) => ({
          servicoId,
          colaboradorId,
        }),
        { session }
      )
    );

    await session.commitTransaction();
    session.endSession();

    if (existentColaborador && existentRelationShip) {
      res.json({ error: true, message: "Colaborador já cadastrado." });
    } else {
      res.json({ error: false });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
});

module.exports = (app) => app.use("/colaborador", router);
