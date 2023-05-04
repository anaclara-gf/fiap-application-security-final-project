function validateData(name, description, value) {
  if (!name || !description || !value) {
    throw {
      code: 400,
      message: "A request deve conter os campos name, description and value",
    };
  }

  const messages = [];

  if (!name.match(/^[a-zA-Z0-9\s]{1,50}$/)) {
    messages.push(
      "O campo name está fora dos padrões, ele deve conter apenas letras e números com no máximo 50 caracteres e não ser vazio."
    );
  }

  if (!description.match(/^[a-zA-Z0-9\s\W]{1,150}$/)) {
    messages.push(
      "O campo description está fora dos padrões, ele deve ter no máximo 150 caracteres e não ser vazio."
    );
  }

  if (typeof value !== "number" || Number.isInteger(value) || value <= 0) {
    console.log(value);
    messages.push(
      "O campo value está fora dos padrões, ele deve ser um número maior que zero do tipo float."
    );
  }

  if (messages.length) {
    throw {
      code: 400,
      message: messages.join(" "),
    };
  }
}

function validateId(id) {
  if (
    !id.match(
      /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/
    )
  ) {
    throw {
      code: 400,
      message:
        "O campo id está fora dos padrões, ele deve ser no formato UUID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    };
  }
}

module.exports = { validateData, validateId };
