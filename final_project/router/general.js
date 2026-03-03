const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// TAREA 7: Registro de usuario
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Usuario registrado exitosamente"});
    } else {
      return res.status(404).json({message: "El usuario ya existe"});    
    }
  } 
  return res.status(404).json({message: "Faltan credenciales"});
});

// TAREA 11: Obtener todos los libros con Promesa
public_users.get('/',function (req, res) {
  const get_books = new Promise((resolve, reject) => {
      resolve(books);
    });
    get_books.then((bks) => res.send(JSON.stringify(bks, null, 4)));
});

// TAREA 11: Obtener por ISBN con Promesa
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) resolve(books[isbn]);
    else reject("Libro no encontrado");
  })
  .then(book => res.json(book))
  .catch(err => res.status(404).json({message: err}));
 });

// TAREA 11: Obtener por Autor con Promesa
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    let filtered = Object.values(books).filter(b => b.author === author);
    resolve(filtered);
  })
  .then(data => res.json(data));
});

// TAREA 11: Obtener por Título con Promesa
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    let filtered = Object.values(books).filter(b => b.title === title);
    resolve(filtered);
  })
  .then(data => res.json(data));
});

public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;