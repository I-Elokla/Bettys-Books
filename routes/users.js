const { check, validationResult } = require('express-validator');
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('./login'); // redirect to the login page if not logged in
    } else { 
        next(); // move to the next middleware function
    } 
};

// Register Route - Get request to render the registration page
router.get('/register', function (req, res, next) {
    res.render('register.ejs', { shopData: { shopName: "Betty's Books" }, errors: [] });  // Pass empty errors array
});

// Registration submission (POST request)
router.post('/registered', [
    check('email').isEmail().withMessage('Please enter a valid email address.'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
    check('first').isAlpha().withMessage('First name can only contain letters.'),
    check('last').isAlpha().withMessage('Last name can only contain letters.')
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register.ejs', { 
            shopData: { shopName: "Betty's Books" }, 
            errors: errors.array() 
        });
    }

    req.body.first = req.sanitize(req.body.first);
    req.body.last = req.sanitize(req.body.last);
    const plainPassword = req.body.password;

    bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
        if (err) return next(err);

        // Simulated database query, replace with actual database logic
        let sqlquery = "INSERT INTO users (First_name, Last_name, Username, Email, Hashed_Password) VALUES (?,?,?,?,?)";
        let newrecord = [req.body.first, req.body.last, req.body.username, req.body.email, hashedPassword];
        
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) return next(err);
            res.send(`Hello ${req.body.first} ${req.body.last}, you are now registered!`);
        });
    });
});

// Login Route
router.get('/login', function (req, res, next) {
    res.render('login.ejs');                                                               
});

router.post('/loggedin', function (req, res, next) {
    const { username, password: plainPassword } = req.body;

    // Retrieve the user from the database using their username
    let sqlquery = "SELECT * FROM users WHERE Username = ?";
    db.query(sqlquery, [username], (err, users) => {
        if (err) {
            return next(err); // Handle query error
        }

        if (users.length === 0) {
            return res.send("No user found with that username.");
        }

        const user = users[0];
        const hashedPassword = user.Hashed_Password;

        // Compare the plain password with the hashed password
        bcrypt.compare(plainPassword, hashedPassword, function(err, result) {
            if (err) {
                return next(err); // Handle bcrypt comparison error
            }

            if (result) {
                // Passwords match; proceed with login and save session
                req.session.userId = user.Username; // Save session with username
                res.send(`Welcome back, ${user.First_name} ${user.Last_name}! You are successfully logged in.`);
            } else {
                // Passwords do not match
                res.send("Invalid username or password. Please try again.");
            }
        });
    });
});

// Logout route
router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('./'); // Redirect to home on error
        }
        res.send('You are now logged out. <a href="./login">Log back in</a>');
    });
});

// Protected User List Route
router.get('/ulist', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM users"; // query database to get all users
    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err);
        }
        res.render("ulist.ejs", { availableUsers: result });
    });
});

// Export the router object so it can be used in index.js
module.exports = router;
