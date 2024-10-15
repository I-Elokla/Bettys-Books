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

// router.get('/ulist', async (req, res, next) => {
//   try {
//       // Query the database to get all users, but exclude the 'hashed_password' field
//       const [users] = await db.query('SELECT id, first_name, last_name, username, email FROM users');
      
//       // Render the users list page and pass the users data to the template
//       res.render('ulist.ejs', { users: users });
//   } catch (err) {
//       next(err);  // Pass errors to the error handler
//   }
// });

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