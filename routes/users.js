// Create a new router
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
})    

router.post('/registered', function (req, res, next) {
  const plainPassword = req.body.password;

  // Hash the password before saving
  bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
      if (err) {
          return next(err); // handle the error properly
      }

      // Simulate saving the hashed password to the database (for now, we just log it)
      console.log('Hashed password:', hashedPassword);

      let sqlquery = "INSERT INTO users (First_name, Last_name, Username, Email, Hashed_Password) VALUES (?,?,?,?,?)"
      let newrecord = [req.body.first, req.body.last, req.body.username, req.body.email, hashedPassword]
      db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email
            result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
            res.send(result)
    })
      
  });
});

router.get('/login', function (req, res, next) {
    res.render('login.ejs')                                                               
})    

router.post('/loggedin', function (req, res, next) {
    const { username, password: plainPassword } = req.body;

    // First, retrieve the user from the database using their username (or email)
    let sqlquery = "SELECT * FROM users WHERE Username = ?";
    db.query(sqlquery, [username], (err, users) => {
        if (err) {
            return next(err); // Handle query error
        }

        // If no user is found, return an error
        if (users.length === 0) {
            return res.send("No user found with that username.");
        }

        // If a user is found, compare the password with the hashed password stored in the DB
        const user = users[0]; // Assuming there is one user with the given username
        const hashedPassword = user.Hashed_Password;

        // Compare the plain password with the hashed password
        bcrypt.compare(plainPassword, hashedPassword, function(err, result) {
            if (err) {
                return next(err); // Handle bcrypt comparison error
            }

            if (result) {
                // Passwords match, proceed with login
                res.send(`Welcome back, ${user.First_name} ${user.Last_name}! You are successfully logged in.`);
            } else {
                // Passwords do not match
                res.send("Invalid username or password. Please try again.");
            }
        });
    });
});

router.get('/ulist', function(req, res, next) {
    let sqlquery = "SELECT * FROM users" // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("ulist.ejs", {availableUsers:result})
     })
})

// Export the router object so it can be used in index.js
module.exports = router;