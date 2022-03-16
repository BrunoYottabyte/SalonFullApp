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
      console.log(endereco);
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
        console.log("throw");
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
    const existentRelationship = await SalaoCliente.find({
      salaoId,
      clienteId,
      status: { $ne: "E" },
    });
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log(existentRelationship);
    console.log(existentCliente);

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

    if (existentCliente && existentRelationship) {
      res.json({ error: true, message: "Cliente já cadastrado" });
    } else {
      res.json({ error: false, message: "Cadastrado com sucesso" });
    }
  } catch (err) {
    console.log("erro catch");
    res.json({ error: true, message: err.message });
  }
});

router.post("/filter", async (req, res) => {
  try {
    const clientes = await Cliente.find(req.body.filters);
    res.json({ error: false, clientes });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.get("/salao/:salaoId", async (req, res) => {
  try {
    const { salaoId } = req.params;
    const clientes = await SalaoCliente.find({
      salaoId,
      status: { $ne: "E" },
    })
      .populate("clienteId")
      .select("clienteId dataCadastro");

    res.json({
      error: false,
      clientes: clientes.map((vinculo) => ({
        ...vinculo.clienteId._doc,
        vinculoId: vinculo._id,
        dataCadastro: vinculo.dataCadastro,
      })),
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.delete("/vinculo/:id", async (req, res) => {
  try {
    await SalaoCliente.findByIdAndUpdate(req.params.id, {
      status: "E",
    });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = (app) => app.use("/cliente", router);
