const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
   
  res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    
    // Find the book with matching ISBN
    const book = Object.values(books).find(book => book.ISBN === isbn);
    
    if (!book) {
        res.status(404).send("ISBN not found");
    }
    else
        res.send(book)
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLowerCase();
    
    // Find the book with matching ISBN
    const book = Object.values(books).filter(book => book.author.toLocaleLowerCase().includes(author));
    
    if (!book) {
        res.status(404).send("Error: Author not found");
    }
    else
        res.send(book)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();
    
    const book = Object.values(books).filter(book => book.title.toLocaleLowerCase().includes(title));
    
    if (!book) {
        res.status(404).send("Error: Title not found");
    }
    else
        res.send(book)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = Object.values(books).find(book => book.ISBN === isbn);
    
    if (!book) {
        res.status(404).send("ISBN not found");
    }
    else 
        res.send(book.reviews)
    
});

module.exports.general = public_users;
