const express = require('express');
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");

// Generating a random 6 character alphanumerical string to use as the shortURL
const generateRandomString = () => {
  return Math.random().toString(36).slice(2,8)  
}

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.post("/urls", (req, res) => {
  console.log(req.body);
  const shortURL = generateRandomString();
    urlDatabase[shortURL] = req.body.longURL
    res.redirect(`/urls/${shortURL}`);
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[`${req.params.shortURL}`]; 
  res.redirect(longURL);
});

// Home page responds with hello when accessed
app.get("/", (req, res) => {
  res.send("Hello!");
});

//Shows the object in json format
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Creating an HTML index page using urlDatabase. templateVars imports urlDatabase to urls_index.ejs
app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies.username 
  };
  res.render("urls_index", templateVars);
});

// Rendering page for creating a new URL
app.get("/urls/new", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies.username 
  };
  res.render("urls_new", templateVars);
});

// Creating the shortURL endpoint
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, longURL: urlDatabase[`${req.params.shortURL}`],
    username: req.cookies.username 
  };
  res.render("urls_show", templateVars);
});

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
  urlDatabase[shortURL] = longURL;
  

  res.redirect('/urls');

})

app.post('/login', (req, res) => {
  const username = req.body.username; 
  res.cookie("username", username)
  res.redirect('/urls');

})

app.post('/logout', (req, res) => {
  res.clearCookie("username")
  res.redirect('/urls');

})







app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});