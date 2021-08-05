// Generating a random 6 character alphanumerical string to use as the shortURL
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

const findUserIDFromEmail = (userDatabase, email) => {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email) {
      return userDatabase[user].userId
    }
  }
  };









module.exports = { generateRandomString, emailInUse, checkPassword, findUserIDFromEmail };