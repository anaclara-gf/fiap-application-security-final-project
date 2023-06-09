const { randomUUID } = require("crypto");

async function connect() {
  if (global.connection && global.connection.state !== "disconnected")
    return global.connection;

  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: 3306,
    user: "test",
    password: "test",
    database: "finalProjectSubst",
    multipleStatements: true,
  });
  console.log("Conectou no MySQL!");
  global.connection = connection;
  return connection;
}

async function getAllProducts() {
  const connection = await connect();

  const query = `SELECT * FROM products LIMIT 1000;`;
  console.log(`Executando query: ${query}`);

  const [rows] = await connection.execute(query);
  console.log(`Rows: ${JSON.stringify(rows)}`);
  return rows;
}

async function getProductById(id) {
  try {
    const connection = await connect();

    const query = `SELECT * FROM products WHERE id = ?;`;
    console.log(`Executando query: ${query} com id ${id}`);
    const [rows] = await connection.query(query, [id]);
    return rows;
  } catch (err) {
    console.log("Erro SQL: " + JSON.stringify(err));
    throw "Erro Inesperado";
  }
}

async function updateProductById(id, name, description, value) {
  try {
    const connection = await connect();

    const query = `UPDATE products SET name = ?, description = ?, value = ? WHERE id = ?;`;
    console.log(
      `Executando query: ${query}, com valores id ${id}, name ${name}, description ${description}, value ${value}`
    );

    const [rows] = await connection.query(query, [
      name,
      description,
      value,
      id,
    ]);
    return rows;
  } catch (err) {
    console.log("Erro SQL: " + JSON.stringify(err));
    throw { code: 500, message: "Erro inesperado ao tentar cadastrar usuário" };
  }
}

async function deleteProductById(id) {
  try {
    const connection = await connect();

    const query = `DELETE FROM products WHERE id = ?;`;
    console.log(`Executando query: ${query} com id ${id}`);

    await connection.query(query, [id]);
  } catch (err) {
    console.log("Erro SQL: " + JSON.stringify(err));
    throw "Erro Inesperado";
  }
}

async function insertProduct(name, description, value) {
  try {
    const connection = await connect();
    const id = randomUUID();

    const query = `INSERT INTO products(id, name, description, value) VALUES (?,?,?,?);`;
    console.log(`Executando query: ${query}`);

    await connection.execute(query, [id, name, description, value]);
  } catch (err) {
    console.log("Erro SQL: " + JSON.stringify(err));
    if (err.errno === 1062) {
      throw {
        code: 400,
        message: "Já existe um produto cadastrado com este usuário!",
      };
    } else {
      throw {
        code: 500,
        message: "Erro inesperado ao tentar cadastrar usuário",
      };
    }
  }
}

module.exports = {
  getProductById,
  getAllProducts,
  insertProduct,
  updateProductById,
  deleteProductById,
};
