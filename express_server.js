// Installed Packages
const express = require('express');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cookieSession = require("cookie-session");
const app = express();
const PORT = 8080; // default port 8080

//Helper functions imported from helpers.js
const { generateRandomString, emailInUse, getUserByEmail, checkCookie, urlsForUser } = require('./helpers.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.set("view engine", "ejs");

//URL Database
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },

  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID"
  }
};

//User Database
const userDatabase = {
  "userRandomID": {
    userId: "userRandomID",
    email: "user@example.com",
    password: "1234"
  },
  "user2RandomID": {
    userId: "user2RandomID",
    email: "user2@example.com",
    password: "4567"
  },
  "abc": {
    userId: "abc",
    email: "abc@example.com",
    password: "1357"
  }
};
// Hashing all of the passwords in the database using bcrypt
for (const user in userDatabase) {
  userDatabase[user].password = bcrypt.hashSync(userDatabase[user].password, 10);
}

//  URL index get & post requests
// Creating an HTML index page using urlDatabase. templateVars imports urlDatabase to urls_index.ejs
app.get("/urls", (req, res) => {

  const templateVars = {
    urls: urlsForUser(urlDatabase, req.session.userId),
    user: userDatabase[req.session.userId]
  };
  res.render("urls_index", templateVars);
});

// urls POST request
app.post("/urls", (req, res) => {
  
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.userId
  };
  res.redirect(`/urls/${shortURL}`);
});

// /u/:shortURL GET request
//user is able to use this shortURL to access the page of the longURL
app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  } else {
    res.status(404).send("This URL does not exist.");
  }
});

// Home page responds with hello when accessed
app.get("/", (req, res) => {
  res.redirect("/urls");
});

//Shows the object in json format
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Rendering page for creating a new URL
app.get("/urls/new", (req, res) => {
  
  if (checkCookie(userDatabase, req.session.userId)) {
    res.redirect('/urls_login');
  
  } else {

    const templateVars = {
      urls: urlDatabase,
      user: userDatabase[req.session.userId]
    };
    res.render("urls_new", templateVars);
  }
});

// Creating the shortURL endpoint
app.get("/urls/:shortURL", (req, res) => {
  if (req.session.userId) {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: userDatabase[req.session.userId]
    };
    res.render("urls_show", templateVars);
  } else {
    res.send("You're not authorized to view this page");
  }
});


// /:shortURL/delete POST request
// Delete a url and redirect back to the /urls page
app.post('/urls/:shortURL/delete', (req, res) => {
  if (req.session.userId) {
    const shortURL = req.params.shortURL;

    //Deleting URL from the database
    delete urlDatabase[shortURL];
    res.redirect('/urls');
  } else {
    res.send("You're not authorized to make any changes");
  }
});

//Update an existing url
// /urls/:shortURL POST request
app.post('/urls/:shortURL', (req, res) => {

  if (req.session.userId) {
    const shortURL = req.params.shortURL;
    //extract the new url value from the form => req.body
    const longURL = req.body.longURL;
    
    // updating the url value for that id
    urlDatabase[shortURL].longURL = longURL;
    
    res.redirect('/urls');
  } else {
    res.send("You're not authorized to access this page");
  }
});

// login POST request
app.post('/login', (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  
  if (!emailInUse(userDatabase, userEmail)) {
    res.status(400).send("A user with that email cannot be found");
  
  } else {
    const userId = getUserByEmail(userEmail, userDatabase);
    
  // comparing the inputted user password with the hashed user password in the database
    if (!bcrypt.compareSync(userPassword, userDatabase[userId].password)) {
      res.status(400).send("The password you've entered is incorrect.");
    } else {
      const userId = getUserByEmail(userEmail, userDatabase);
      req.session.userId = userId;
      res.redirect('/urls');
      
    }
  }
});

// login GET request
app.get('/urls_login', (req, res) => {
  res.render("urls_login");
});

// logout POST request
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');

});

// register GET request
app.get('/urls_register', (req, res) => {
  const user = req.session.userId;
  if (user) {
    res.redirect('/urls');
  }
  res.render("urls_register");

});

// register POST request
app.post('/urls_register', (req, res) => {
  const registeredEmail = req.body.email;
  const registeredPassword = req.body.password;
  

  if (registeredEmail === "" || registeredPassword === "") {
    res.status(400).send('You have not entered an email/password.');

  } else if (emailInUse(userDatabase, registeredEmail)) {
    res.status(400).send('This Email address is already in use.');
  
  } else {
    
    //creating new user using a randomized userId and setting up a new object containing the new userId, email and hashed password
    const userId = generateRandomString();
    userDatabase[userId] = {
      userId,
      email: registeredEmail,
      password: bcrypt.hashSync(registeredPassword, 10),
    };
    req.session.userId = userId;
    return res.redirect("/urls");
  }
  

});



// server listening
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});