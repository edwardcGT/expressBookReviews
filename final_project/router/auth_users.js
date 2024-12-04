const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
let books = require("./booksdb.js");
const regd_users = express.Router();
const SECRET = "fingerprint_customer";

let users = [{"username":"user1", "password":"password01"}, 
  {"username": "user2", "password":"password02"},
  {"username": "userX", "password":"passwordX"}
  
];

const isValid = (username)=>{ //returns boolean
  const user = users.find(u => u.username === username);
  if (!user) {
      return false; // User not found
  }
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const user = users.find(user => user.username === username);
  if (!user) 
      return false;
  if (user.password != password)
      return false; 
  return true;
}
//only registered users can login
regd_users.post("/login", (req,res) => {
  const contentType = req.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) 
    res.status(400).json({message: "Please send only application/json data"});


  const { username: cUsername, password } = req.body;
  if (!authenticatedUser(cUsername, password))
    res.status(400).json({message: "Invalid username or password"});

  const token = jwt.sign({username: cUsername}, SECRET,{ expiresIn: '1h' });
  //res.setHeader('Authorization', `Bearer ${token}`);
  
  res.cookie('token', token, {
    httpOnly: true,         // Cannot be accessed by JavaScript
    secure: false,          // Only sent over HTTPS
    sameSite: 'lax',    // CSRF protection
    maxAge: 3600000,       // 1 hour in milliseconds
    path: '/'             // Cookie path
  
  });
  req.session.isAuthenticated = true;
  req.session.username = cUsername;
  res.status(200).json({
    success: true,
    message: 'Authentication successful',
    token: token,
    username: cUsername
    });
});

regd_users.get('/logout', (req, res) => {
  // Destroy the session
  res.clearCookie('token');
  req.session.destroy((err) => {
      if (err) {
          res.status(500).json({message: "Could not log out"});
      }
      res.status(200).json({message: "Logout successful"});
  });
});
// Add a book review

regd_users.put("/auth/review/:isbn", (req, res, next) => {
  const isbn = req.params.isbn;
  const cUserName = req.session.username;
  
  const contentType = req.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) 
    res.status(400).json({message: "Please send only application/json data"});

  const { rating, comment } = req.body;
  if (!rating || !comment)
    res.status(400).json({message: "Both rating and comment are required"});
  
    if (!req.session.isAuthenticated) 
    res.status(400).json({message: "Please login to rate"});
  
  // Find the book with matching ISBN
  //const book = Object.values(books).find(book => book.ISBN === isbn);
  const bookId = Object.keys(books).find(id => books[id].ISBN === isbn);
    
  if (!bookId) {
      res.status(404).json({message: "ISBN not found"});
  }
  console.log(`>>> ${bookId}`)
  const userReview = Object.entries(books[bookId].reviews).find(([username, _]) => username === cUserName);
    
  const reviewData = {
    rating,
    comment,
    date: new Date().toISOString().split('T')[0]
  };

  books[bookId].reviews[cUserName] = reviewData;

  if (userReview) {
    res.status(200).json({message:`Review by ${cUserName} is overwritten successfully`})
  }
  else{
    res.status(200).json({message:`New review by ${cUserName} is submitted successfully`})
  }
  next();
});


regd_users.delete("/auth/review/:isbn", (req, res, next) => {
  const isbn = req.params.isbn;
  const cUserName = req.session.username;
  
  const contentType = req.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) 
    res.status(400).json({message: "Please send only application/json data"});

  if (!req.session.isAuthenticated) 
    res.status(400).json({message: "Please login to rate"});
  
  // Find the book with matching ISBN
  //const book = Object.values(books).find(book => book.ISBN === isbn);
  const bookId = Object.keys(books).find(id => books[id].ISBN === isbn);
    
  if (!bookId) {
      res.status(404).json({message: "ISBN not found"});
  }
  console.log(`>>> ${bookId}`)
  const userReview = Object.entries(books[bookId].reviews).find(([username, _]) => username === cUserName);
  
  if (userReview) {
    books[bookId].reviews[cUserName].delete;
    res.status(200).json({message:`Review by ${cUserName} is deleted successfully`})
  }
  else{
    res.status(200).json({message:`${cUserName} does not have any review for this book`})
  }
  next();
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
