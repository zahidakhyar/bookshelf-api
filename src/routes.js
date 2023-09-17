const Joi = require("joi");

const books = require("./books/handler");
const booksValidation = require("./books/validation");

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: books.create,
  },
  {
    method: "GET",
    path: "/books",
    handler: books.get,
  },
  {
    method: "GET",
    path: "/books/{bookId}",
    handler: books.find,
  },
  {
    method: "PUT",
    path: "/books/{bookId}",
    handler: books.update,
  },
  {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: books.deleteById,
  },
];

module.exports = routes;
