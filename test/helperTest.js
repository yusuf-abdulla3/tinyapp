const expect  = require('chai').expect;

const { generateRandomString, emailInUse, checkPassword, getUserByEmail, checkCookie, urlsForUser } = require('../helpers.js');


const testUsers = {
  "userRandomID": {
    userId: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    userId: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const testUrls = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userId: "userRandomID"
  },

  "9sm5xK": {
    longURL: "http://www.google.com",
    userId: "user2RandomID"
  }
};

// getUserByEmail helper test
describe('getUserByEmail', () => {
  it('should return a user with a valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    expect(user).to.equal(expectedOutput);
  });
  it ('should return undefined if the user does not exist in the userDatabase', () => {
    const user = getUserByEmail("345@example.com", testUsers)
    const expectedOutput = undefined;
    expect(user).to.equal(expectedOutput);

  });

});

// generateRandomString helper test
describe('generateRandomString', () => {
  it('should return a string with 6 characters (numbers or letters', () => {
    const randomNumber = generateRandomString();
    const expectedOutput = 6;
    expect(randomNumber.length).to.equal(6);
  });
});

// checkPassword helper test
describe('checkPassword', () => {

  it("should return true if the password entered matches the password in the database", () => {
    
    const checkPasswordTest = checkPassword(testUsers, "purple-monkey-dinosaur");

    expect(checkPasswordTest).to.be.true;
  })
  it("should return false if the password entered does not match a password in the database", () => {
    
    const checkPasswordTest = checkPassword(testUsers, "testpassword123");

    expect(checkPasswordTest).to.be.false;
  })
});

// emailInUse helper test
describe('emailInUse', () => {

  it("should return true if the email entered matches an email in the database", () => {
    const emailInUseTest = emailInUse(testUsers, "user2@example.com");
    expect(emailInUseTest).to.be.true;
  });
  
  it("should return false if the email entered does not match an email in the database", () => {
    const emailInUseTest = emailInUse(testUsers, "fakeEmail@example.com");
    expect(emailInUseTest).to.be.false;
  });
  it("should return false if no email is entered", () => {
    const emailInUseTest = emailInUse(testUsers, "");
    expect(emailInUseTest).to.be.false;
  });
});

// checkCookie helper test
describe('checkCookie', () => {
  it('should return true if the cookie matches a userId in the database', () => {
    const cookie = "userRandomID"
    const checkCookieTest = checkCookie(testUsers, cookie)
    expect(checkCookieTest).to.be.true;
  });
  it('should return false if the cookie does not match a userId in the database', () => {
    const cookie = "fakeTestId"
    const checkCookieTest = checkCookie(testUsers, cookie)
    expect(checkCookieTest).to.be.false;
  });
});


// urlsForUser helper test
describe('urlsForUser', () => {
  it('should return the object from the urldatabase that is assigned to a specific user ', () => {
   const userId = 'userRandomID';
   const urlsForUserObj = urlsForUser(testUrls, userId);
   const expectedOutput = {
     "b2xVn2": {
        longURL: "http://www.lighthouselabs.ca",
        userId: "userRandomID"
      }
    };
  expect(urlsForUserObj).to.deep.equal(expectedOutput);
  });
});
