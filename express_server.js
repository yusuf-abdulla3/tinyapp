const express = require('express');
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");
const { generateRandomString, emailInUse, checkPassword, findUserIDFromEmail, checkCookie, urlsForUser } = require('./helpers.js') 
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

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
}
//  URL index get & post requests

// Creating an HTML index page using urlDatabase. templateVars imports urlDatabase to urls_index.ejs
app.get("/urls", (req, res) => {
  
  const templateVars = { 
    urls: urlsForUser(urlDatabase, req.cookies.userId),
    user: userDatabase[req.cookies.userId]
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
   console.log(req.body);
  const shortURL = generateRandomString();
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: req.cookies.userId
    },
    res.redirect(`/urls/${shortURL}`);
})

app.get("/u/:shortURL", (req, res) => {
  console.log(req.params)
  if (urlDatabase[req.params.shortURL]) {
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  } else {
    res.status(404).send("This TinyURL does not exist.")
  }
});

// Home page responds with hello when accessed
app.get("/", (req, res) => {
  res.send("Hello!");
});

//Shows the object in json format
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Rendering page for creating a new URL
app.get("/urls/new", (req, res) => {
  
  if (checkCookie(userDatabase, req.cookies.userId)) {
    res.redirect('/urls_login')
  
  } else {

  const templateVars = { 
    urls: urlDatabase,
    user: userDatabase[req.cookies.userId]
  }
  
  res.render("urls_new", templateVars)
  
  }

});

// Creating the shortURL endpoint
app.get("/urls/:shortURL", (req, res) => {
  console.log(req.params.shortURL)
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: userDatabase[req.cookies.userId] 
  };
  res.render("urls_show", templateVars);
});

// /:shortURL get & post requests

// Delete a url and redirect back to the /urls page
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  //Deleting URL from the database
  delete urlDatabase[shortURL];

  res.redirect('/urls');
})

//Update an existing url

app.post('/urls/:shortURL', (req, res) => {

  const shortURL = req.params.shortURL;
  //extract the new url value from the form => req.body
  const longURL = req.body.longURL;
  
  // updating the url value for that id
  urlDatabase[shortURL].longURL = longURL;
  
  res.redirect('/urls');

})

// /login post & get requests
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //console.log(email)
  
  if (!emailInUse(userDatabase, email)) {
    res.status(403).send("A user with that email cannot be found")
    // console.log(req.body)
  } else {
    if (!checkPassword(userDatabase, password)) {
      res.status(403).send("The password you've entered is incorrect.")
    } else {
      const userId = findUserIDFromEmail(userDatabase, email)
      res.cookie("userId", userId)
      res.redirect('/urls')
      
  } 
}

 
  })

app.get('/urls_login', (req, res) => {
  res.render("urls_login")
})
// log post request
app.post('/logout', (req, res) => {
  res.clearCookie("userId")
  res.redirect('/urls');

})

// register get & post requests 
app.get('/urls_register', (req, res) => {

  res.render("urls_register");

})

app.post('/urls_register', (req, res) => {
  const userId = generateRandomString();
  const userObject = {
    userId: userId,
    email: req.body.email,
    password: req.body.password
  }

  if (userObject.email === "" || userObject.password === "") {
    res.status(400).send('You have not entered an email/password.');
  } else if (emailInUse(userDatabase, userObject.email)) {
    res.status(400).send('This Email address is already in use.');
  }
  
  const createNewUser = (userDatabase, user) => {
    if (!userDatabase[user.userId]) {
      userDatabase[userId] = user;
      return user;
    }
    return null;
  };

  const user = createNewUser(userDatabase, userObject)
  if (user) {
    res.cookie("userId", userObject.userId)

    return res.redirect("/urls")
  }

  res.redirect("/urls_register")

})



// server listening
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});