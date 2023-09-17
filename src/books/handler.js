const { nanoid } = require("nanoid");
const books = require("../../entities/books");
const { validate } = require("./validation");
const response = require("../../helper/response");

const create = async (request, h) => {
  const { payload } = request;

  const { message } = validate(request.payload, "create");

  if (message) {
    return response(h, "fail", message, null, 400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  books.push({
    id: id,
    ...payload,
    finished: payload.pageCount === payload.readPage,
    insertedAt: insertedAt,
    updatedAt: updatedAt,
  });

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (!isSuccess) {
    return response(h, "fail", "Buku gagal ditambahkan", null, 500);
  }

  return response(
    h,
    "success",
    "Buku berhasil ditambahkan",
    {
      bookId: id,
    },
    201
  );
};

const get = async (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading) {
    filteredBooks = filteredBooks.filter((book) => book.reading == reading);
  }

  if (finished) {
    filteredBooks = filteredBooks.filter((book) => book.finished == finished);
  }

  return response(h, "success", null, {
    books: filteredBooks.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    })),
  });
};

const find = async (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((book) => book.id === bookId)[0];

  if (!book) {
    return response(h, "fail", "Buku tidak ditemukan", null, 404);
  }

  return response(h, "success", null, {
    book: book,
  });
};

const update = async (request, h) => {
  const { bookId } = request.params;
  const { payload } = request;

  const { message } = validate(request.payload, "update");

  if (message) {
    return response(h, "fail", message, null, 400);
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return response(
      h,
      "fail",
      "Gagal memperbarui buku. Id tidak ditemukan",
      null,
      404
    );
  }

  const updatedAt = new Date().toISOString();

  books[index] = {
    ...books[index],
    ...payload,
    finished: payload.pageCount === payload.readPage,
    updatedAt: updatedAt,
  };

  return response(h, "success", "Buku berhasil diperbarui", null, 200);
};

const deleteById = async (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return response(
      h,
      "fail",
      "Buku gagal dihapus. Id tidak ditemukan",
      null,
      404
    );
  }

  books.splice(index, 1);

  return response(h, "success", "Buku berhasil dihapus", null, 200);
};

module.exports = {
  create,
  get,
  find,
  update,
  deleteById,
};
