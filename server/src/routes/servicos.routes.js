const express = require("express");
const router = express();
const busboy = require("busboy");
const aws = require("../services/aws");
const Arquivo = require("../models/arquivo");
const Servico = require("../models/servico");

// ROTA RECEBE FORM DATA
router.post("/", async (req, res) => {
  try {
    // let bb = busboy({ headers: req.headers});
    // bb.on("finish", async () => {

    const { salaoId, servico } = req.body;
    let errors = [];
    let arquivos = [];

    console.log(req.files, Object.keys(req.files));
    if (req.files && Object.keys(req.files).length > 0) {
      for (let key of Object.keys(req.files)) {
        const file = req.files[key];

        const namesParts = file.name.split("."); //[646455, jpg]
        const fileName = `${new Date().getTime()}.${
          namesParts[namesParts.length - 1]
        }`;
        const path = `servicos/${salaoId}/${fileName}`;

        const response = await aws.uploadToS3(file, path);
        if (response.error) {
          errors.push({ error: true, message: response.message });
        } else {
          arquivos.push(path);
        }
      }
    }

    if (errors.length > 0) {
      res.json(errors[0]);
      return false;
    }

    //CRIAR SERVIÇO
    let jsonServico = JSON.parse(servico);
    const servicoCadastrado = await Servico(jsonServico).save();

    //CRIAR ARQUIVO
    arquivos = arquivos.map((arquivo) => ({
      referenciaId: servicoCadastrado._id,
      model: "Servico",
      caminho: arquivo,
    }));
    await Arquivo.insertMany(arquivos);
    res.json({ servico: servicoCadastrado, arquivos });
  } catch (err) {
    res.json({ error: true, message: err.message, em2: "Não executei" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { salaoId, servico } = req.body;
    let errors = [];
    let arquivos = [];

    console.log(req.files, Object.keys(req.files));
    if (req.files && Object.keys(req.files).length > 0) {
      for (let key of Object.keys(req.files)) {
        const file = req.files[key];

        const namesParts = file.name.split("."); //[646455, jpg]
        const fileName = `${new Date().getTime()}.${
          namesParts[namesParts.length - 1]
        }`;
        const path = `servicos/${salaoId}/${fileName}`;

        const response = await aws.uploadToS3(file, path);
        if (response.error) {
          errors.push({ error: true, message: response.message });
        } else {
          arquivos.push(path);
        }
      }
    }

    if (errors.length > 0) {
      res.json(errors[0]);
      return false;
    }

    //CRIAR SERVIÇO
    const jsonServico = JSON.parse(servico);
    console.log("servico req", servico, "servico parse", jsonServico);

    await Servico.findByIdAndUpdate(req.params.id, jsonServico);

    //CRIAR ARQUIVO
    arquivos = arquivos.map((arquivo) => ({
      referenciaId: req.params.id,
      model: "Servico",
      caminho: arquivo,
    }));
    await Arquivo.insertMany(arquivos);
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message, em2: "Não executei" });
  }
});

router.get('/salao/:salaoId', async(req, res) => {
  try{
    let servicosSalao = [];
    const servicos = await Servico.find({
      salaoId: req.params.salaoId,
      status: {$ne: 'E'},
    })

    for (let servico of servicos){
      const arquivos = await Arquivo.find({
        model: 'Servico',
        referenciaId: servico._id
      });
      servicosSalao.push({...servico._doc, arquivos});
    }

    res.json({servicos: servicosSalao})
  }
  catch(err){
    res.json({error: true, message: err.message})
  }
})

router.post("/delete-arquivo", async (req, res) => {
  try {
    const { id } = req.body;

    //excluir aws
    await aws.deleteFileS3(id);
    await Arquivo.findOneAndDelete({
      caminho: id,
    });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Servico.findByIdAndUpdate(id, { status: "E" });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});
module.exports = (app) => app.use("/servico", router);
