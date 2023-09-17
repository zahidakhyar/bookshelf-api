const Joi = require("joi");

const request = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(2021).required(),
  author: Joi.string().required(),
  summary: Joi.string().required(),
  publisher: Joi.string().required(),
  pageCount: Joi.number().integer().required(),
  readPage: Joi.number().integer().required(),
  reading: Joi.boolean().required(),
});

const validate = (payload, state) => {
  const { error: errors } = request.validate(payload);
  let message, prefix;

  if (state == "create") {
    prefix = "Gagal menambahkan buku.";
  } else if (state == "update") {
    prefix = "Gagal memperbarui buku.";
  }

  if (errors) {
    const error = errors.details[0];

    console.log(error);

    if (error.type === "any.required") {
      message = `${prefix} Mohon isi ${error.context.label}`;

      if (error.context.label === "name") {
        message = `${prefix} Mohon isi nama buku`;
      }
    } else {
      message = `${prefix} field ${error.message.replace(/['"]+/g, "")}`;
    }

    return {
      message,
    };
  }

  if (payload.readPage > payload.pageCount) {
    message = `${prefix} readPage tidak boleh lebih besar dari pageCount`;
  }

  return {
    message,
  };
};

module.exports = {
  request,
  validate,
};
