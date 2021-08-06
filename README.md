# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (kind of like bit.ly).

## Final Product

![Home page Before Logging In](/images/home_page1.jpg)

![Registration page](#)

![Home page after logging In](#)

![Create new URL page which can be accessed from the home page](#)

![Page containing newly created shortURL where you can edit, delete or access the website linked to via the shortURL](#)



## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Access TinyApp by entering "http://localhost:8080/ on your browser once you've ran the webserver!
- Start creating your very own collection of shortURLs! 

## How it works!
### Register
- Register for an account using an email and password of your choice that you will be using to login with.

### Login
- If you already have an account, use the email and password that you registered with in order to start using TinyApp. This will give you access to your personal collection of URLs.

### Create a Link

- In order to create a link, click on the "Create a Link" button at the top of the page and it will direct you to a page where you'll be able to enter any link that you choose.
- You're new link will be a shortened URL that will be saved on your home page (/urls)! 

### Edit Or Delete Links

- Once you've created your link you'll be directed to a new page that contains the link that you've just created. Here you can edit this link if you would like to replace it with another link instead! 
- If you'd like to delete any links, head to the home page and you will be able to both delete the URLs if you added there or also be redirected to the URL edit page if you'd like by clicking on the respective "edit" or "delete" buttons
