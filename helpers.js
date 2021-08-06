// Generates a random 6 character alphanumerical string to use as the shortURL
const generateRandomString = () => {
  return Math.random().toString(36).slice(2,8)  
}


const emailInUse = (userDatabase, email) => {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email) {
      return true;
    }
  }
  return false;
};

const checkPassword = (userDatabase, password) => {
  for (const user in userDatabase) {
    if (userDatabase[user].password === password) {
      return true;
    }
  }
  return false;
};

const getUserByEmail = (email, userDatabase) => {
  for (const user in userDatabase) {

    if (userDatabase[user].email === email) {
      return userDatabase[user].userId
    }
  }
  };

  const checkCookie = (userDatabase, cookie) => {
    for (const user in userDatabase) {
      if (userDatabase[user].userId === cookie) {
        return true;
      }
    }
    return false;
  }

  const urlsForUser = (urlDatabase, id) => {
    const urlsObj = {};
    for (const shortURL in urlDatabase) {
      if (urlDatabase[shortURL].userId === id) {
        urlsObj[shortURL] = urlDatabase[shortURL];
      }
    }
    return urlsObj;
  };

    







module.exports = { generateRandomString, emailInUse, checkPassword, getUserByEmail, checkCookie, urlsForUser };