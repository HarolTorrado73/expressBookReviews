console.log("¡ESTOY CARGANDO EL ARCHIVO CORRECTO!");
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error al iniciar sesión: faltan credenciales" });
  }

  // Verificar si el usuario existe y la contraseña coincide
  const authenticatedUser = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  if (authenticatedUser.length > 0) {
    // Generar el Token JWT
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Guardar el token en la sesión
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("Usuario ha iniciado sesión exitosamente");
  } else {
    return res.status(208).json({ message: "Inicio de sesión inválido. Verifique su usuario y contraseña" });
  }
});
/*
// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on ISBN
public_users.get('/', function (req, res) {
  // Simulamos la operación asíncrona con una Promesa (Requisito Tarea 10)
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });

  getBooks.then((booksList) => {
    res.status(200).send(JSON.stringify(booksList, null, 4));
  });
});

// Get book details based on author
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Error: No se pudieron cargar los libros");
    }
  });

  getBooks
    .then((bookList) => {
      // Enviamos la respuesta JSON real
      res.status(200).send(JSON.stringify(bookList, null, 4));
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});
*/
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Error: No se pudieron cargar los libros");
    }
  });

  getBooks
    .then((bookList) => {
      console.log("LOG: Tarea 10 ejecutada correctamente");
      res.status(200).send(JSON.stringify(bookList, null, 4));
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    const filteredBooks = [];

    keys.forEach((key) => {
      if (books[key].title === title) {
        filteredBooks.push({
          isbn: key,
          author: books[key].author,
          reviews: books[key].reviews
        });
      }
    });

    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No se encontró ningún libro con ese título, intenta con otro nombre.");
    }
  })
  .then((data) => res.status(200).json(data))
  .catch((err) => res.status(404).json({ message: err }));
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Esto toma el numero que pongas en la URL

  // Usamos la Promesa para cumplir con los requisitos previos
  const findBookByIsbn = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Libro no encontrado");
    }
  });

  findBookByIsbn
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  // Promesa para  Tarea 10
  new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    const filteredBooks = [];

    keys.forEach((key) => {
      if (books[key].author === author) {
        filteredBooks.push({
          isbn: key,
          title: books[key].title,
          reviews: books[key].reviews
        });
      }
    });

    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No se encontraron libros de este autor, intenta con otro nombre.");
    }
  })
  .then((data) => res.status(200).json(data))
  .catch((err) => res.status(404).json({ message: err }));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book.reviews);
    } else {
      reject("No se encontró el libro");
    }
  })
  .then((reviews) => res.status(200).json(reviews))
  .catch((err) => res.status(404).json({ message: err }));
  //return res.status(300).json({ message: "Yet to be implemented" }); mejor quitar para dejar el araay vacio
});

module.exports.general = public_users;
