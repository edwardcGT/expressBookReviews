const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Create axios instance with custom config
const api = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

public_users.post("/register", (req,res) => {
    const {username, password } = req.body;
     
    console.log(`username >> ${username}`)
    console.log(`username >> ${password}`)
        // Validation
    if (!username || !password)
        res.status(400).send("Username and password are required");

    if (isValid(username))
        res.status(400).send("Username already exist. Registration failed.");
    
    users.push({
        username: username,
        password: password
    });
    console.log(`Users >> ${JSON.stringify({users}, null, 4)}`)
    
    res.status(200).send("New user is successfully registered")    
});

 const fetchBooks = async (retries = 3) => {
    
 }; 


// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    const response = await api.get('/books');
    res.json(response.data);
});

public_users.get('/books', function (req, res)  {
    res.json(books);
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

 public_users.get('/a-isbn/:isbn',async (req, res) => {
    const isbn = req.params.isbn;
    const response = await api.get(`/isbn/${isbn}`);
    res.json(response.data);
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

public_users.get('/a-author/:author',async (req, res) => {
    const author = req.params.author;
    const response = await api.get(`/author/${author}`);
    res.json(response.data);
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

public_users.get('/a-title/:title',async (req, res) => {
    const title = req.params.title;
    const response = await api.get(`/title/${title}`);
    res.json(response.data);
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
