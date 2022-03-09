const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const pagarme = require("../services/pagarme");
const Cliente = require("../models/cliente");
const SalaoCliente = require("../models/relationship/salaoCliente");

router.post("/", async (req, res) => {
  const db = mongoose.connection;
  const session = await db.startSession();
  session.startTransaction();

  try {
    const { cliente, salaoId } = req.body;
    let newCliente = null;

    //VERIFICAR SE O CLIENTE EXISTE
    const existentCliente = await Cliente.findOne({
      $or: [{ email: cliente.email }, { telefone: cliente.telefone }],
    });

    //Se não existir Cliente
    if (!existentCliente) {
      const _id = mongoose.Types.ObjectId();
      //criar Customer
      const { documento, endereco } = cliente;
        console.log(_id)
      const pagarmeCustomer = await pagarme("customers", {
        name: cliente.nome,
        email: cliente.email,
        code: _id,
        document: documento.numero,
        type: documento.tipo,
        document_type: documento.docType,
        gender: cliente.sexo === "M" ? "male" : "female",
        address: {
          line_1: endereco.rua,
          line_2: endereco.complementar,
          zip_code: endereco.cep,
          city: endereco.cidade,
          state: endereco.uf,
          country: endereco.pais,
        },
        birthdate: cliente.dataNascimento,
        phones: {
          mobile_phone: {
            country_code: endereco.paisCode,
            area_code: cliente.area,
            number: cliente.telefone,
          },
        },
      });

      if (pagarmeCustomer.error) {
        throw pagarmeCustomer;
      }

      //Criando Cliente

      newClient = await Cliente({
        ...cliente,
        _id,
        customerId: pagarmeCustomer.data.data.id,
      }).save({ session });
    }

    //RELACIONAMENTO
    const clienteId = existentCliente ? existentCliente._id : newClient._id;

    //Verifica se já existe o relacionamento com o salão
    const existentRelationship = await SalaoCliente.findOne({
      salaoId,
      clienteId,
      status: { $ne: "E" },
    });

    //SE NÃO ESTÁ VINCULADO
    if (!existentRelationship) {
      await new SalaoCliente({
        salaoId,
        clienteId,
      }).save({ session });
    }

    //SE JÁ EXISTIR O VINCULO ENTRE CLIENTE E SALÃO
    if (existentCliente) {
      await SalaoCliente.findOneAndUpdate(
        {
          salaoId,
          clienteId,
        },
        {
          status: "A",
        },
        { session }
      );
    }


    await session.commitTransaction();
    session.endSession();

    if(existentCliente && existentRelationship){
        res.json({ error: true, message: 'Cliente já cadastrado'})
    }else{
        res.json({error: false})
    }

  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = (app) => app.use("/cliente", router);
