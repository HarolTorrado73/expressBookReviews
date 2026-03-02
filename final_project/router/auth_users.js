const express = require('express');
const jwt = require('jsonwebtoken');
if (!global.books) {
    global.books = require("./booksdb.js");
}
let books = global.books;
const regd_users = express.Router();

let users = [{username: "harol", password: "mi_password123"}];

const isValid = (username)=>{ 
  let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
}

const authenticatedUser = (username,password)=>{ 
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error al iniciar sesión"});
  }

  // Usamos la función isValid que suele venir en el esqueleto
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("Usuario ha iniciado sesión exitosamente");
  } else {
    return res.status(208).json({message: "Credenciales inválidas"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = "harol"; 

  // Accedemos directamente al objeto books que importaste arriba
  if (books[isbn]) {
      books[isbn]["reviews"][username] = review;
      console.log("Reseña guardada en servidor:", books[isbn].reviews); // Esto saldrá en la terminal de npm start
      return res.status(200).json({message: "OK"});
  }
  return res.status(404).send("Libro no encontrado");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = "harol";

  if (books[isbn] && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({message: "Reseña eliminada correctamente"});
  } else {
      return res.status(404).json({message: "No se encontró reseña para este usuario"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
