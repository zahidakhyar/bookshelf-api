const response = (h, status, message, data, code = 200) => {
  let response;

  if (data === null) {
    response = h.response({
      status,
      message,
    });
  }

  if (message === null) {
    response = h.response({
      status,
      data,
    });
  }

  if (data !== null && message !== null) {
    response = h.response({
      status,
      message,
      data,
    });
  }

  response.code(code);

  return response;
};

module.exports = response;
