const fs   = require('fs');

const express = require("express");
const app = express();
const port = 3001;

const db = require("./db");
const validation = require("./utils");

var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/products", async (req, res, next) => {
  var resp = await db.getAllProducts();
  res.status(200).json(resp);
});

app.post("/products", async (req, res, next) => {
  try {
    var name = req.body.name;
    var description = req.body.description;
    var value = req.body.value;

    validation.validateData(name, description, value);

    await db.insertProduct(name, description, value);
    return res.status(200).json({ message: "Produto cadastrado com sucesso!" });
  } catch (err) {
    return res.status(err.code).json(err);
  }
});

app.get("/products/:id", async (req, res, next) => {
  try {
    var id = req.params.id;
    validation.validateId(id);
    const [rows] = await db.getProductById(id);
    if (rows) {
      return res.status(200).send(rows);
    }
    return res.status(404).send(`Produto ${id} não encontrado!`);
  } catch (err) {
    return res.status(err.code).json(err);
  }
});

app.put("/products/:id", async (req, res, next) => {
  try {
    var id = req.params.id;

    var name = req.body.name;
    var description = req.body.description;
    var value = req.body.value;

    validation.validateId(id);
    validation.validateData(name, description, value);

    const rows = await db.updateProductById(id, name, description, value);
    if (rows) {
      return res
        .status(200)
        .send({ message: "Produto atualizado com sucesso!" });
    }
    return res.status(404).send(`Produto ${id} atualizado com sucesso!`);
  } catch (err) {
    return res.status(err.code).json(err);
  }
});

app.delete("/products/:id", async (req, res, next) => {
  try {
    var id = req.params.id;
    validation.validateId(id);
    await db.deleteProductById(id);
    return res
      .status(200)
      .send({ message: `Produto ${id} deletado com sucesso!` });
  } catch (err) {
    return res.status(err.code).json(err);
  }
});

var https = require('https');
var privateKey  = fs.readFileSync('./sslcert/selfsigned.key', 'utf8');
var certificate = fs.readFileSync('./sslcert/selfsigned.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(port);
