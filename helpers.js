//Helper Functions that are used in express_server.js

// Generates a random 6 character alphanumerical string to use as the shortURL
const generateRandomString = () => {
  return Math.random().toString(36).slice(2,8);
};

// Checks to see if the email is already being used by another user in the database
const emailInUse = (userDatabase, email) => {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email) {
      return true;
    }
  }
  return false;
};

//Finds the users userId based on their email
const getUserByEmail = (email, userDatabase) => {
  for (const user in userDatabase) {

    if (userDatabase[user].email === email) {
      return userDatabase[user].userId;
    }
  }
};

// Checks to see if a user is who they say they are by comparing their cookieId with their userId
const checkCookie = (userDatabase, cookie) => {
  for (const user in userDatabase) {
    if (userDatabase[user].userId === cookie) {
      return true;
    }
  }
  return false;
};

// Returns the object in the urlsDatabase that contains the urls associated with a user
const urlsForUser = (urlDatabase, id) => {
  const urlsObj = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userId === id) {
      urlsObj[shortURL] = urlDatabase[shortURL];
    }
  }
  return urlsObj;
};

    







module.exports = { generateRandomString, emailInUse, getUserByEmail, checkCookie, urlsForUser };