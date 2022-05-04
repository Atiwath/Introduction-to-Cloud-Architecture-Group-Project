const port = '80';
const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const dbConnection = require('./database');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.static(__dirname + '/scr'));
app.use(express.urlencoded({ extended: false }));

// SET OUR VIEWS AND VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// APPLY COOKIE SESSION MIDDLEWARE
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 3600 * 1000 // 1hr
}));
var session_mode = 0;
var name_is = '';

////////////////////////////////////////////////////////////////////////////////////////
app.get('/', function (req, res) {
    //  console.log('index');
    // console.log(session_mode);
    //  console.log(req.session.isLoggedIn);
    if (!req.session.isLoggedIn) {
        console.log("NO");
        session_mode = 0;
        name_is = '';
        res.render("index", { age: session_mode });
    } else if (req.session.isLoggedIn) {
        //    console.log("LOG");
        session_mode = 10;
         dbConnection.execute("SELECT * FROM `userDetail` WHERE `id`=?", [req.session.userID])
        //dbConnection.execute("SELECT * FROM `touristAttractionDetail` WHERE `TID`= ?",[1])
            .then(([rows]) => {
                // console.log([rows]);
                name_is = rows[0].name;
                res.render('index', {
                    age: session_mode,
                    name: rows[0].name,
                    lastname: rows[0].lastname,
                    email: rows[0].email

                    
                });
            });
    }
});

app.get('/login', function (req, res) {
    // console.log('login');
    // console.log(session_mode);
    res.render("login", { age: 0 });

});

app.get('/register', function (req, res) {
    // console.log('USER API register');
    // console.log(session_mode);
    res.render("register", { age: 0 });

});


app.get('/logout', (req, res) => {
    //session destroy
    req.session = null;
    res.redirect('/');
});

app.get('/map', (req, res) => {

    dbConnection.execute("SELECT * FROM `touristAttractionDetail` WHERE `TID`= ?",[1]).then(([rows]) => {
        // console.log([rows]);
         console.log(rows[0].region);
         res.render('map', {
             name: name_is,
             age: session_mode,
             region: rows[0].region,
             province: rows[0].province,
             contactNumber: rows[0].contactNumber,
             touristSpot: rows[0].touristSpot,
             highSeason:rows[0].highSeason,
             signatureFood:rows[0].signatureFood,
             vimages:rows[0].vimages

         });
     });

});

///////////////////////////POST ///////////////////////////////////////////////

app.post('/login', [
    body('user_email').custom((value) => {
        // console.log(value);
        return dbConnection.execute('SELECT email FROM userDetail WHERE email=?', [value])
            .then(([rows]) => {
                console.log(rows);
                console.log(rows.length);
                if (rows.length == 1) {
                    return true;

                }
                return Promise.reject('Invalid Email Address!');

            });

    }),
    body('user_pass', 'Password is empty!').trim().not().isEmpty(),
], (req, res) => {
    const validation_result = validationResult(req);
    // console.log("ก่อน  %s", req.body);
    const { user_pass, user_email } = req.body;
    // console.log("validation_result :  %s", validation_result.isEmpty());
    if (validation_result.isEmpty()) {
        dbConnection.execute("SELECT * FROM `userDetail` WHERE `email`=?", [user_email])
            .then(([rows]) => {
                // console.log("password :  %s", rows[0].password);
                bcrypt.compare(user_pass, rows[0].password).then(compare_result => {
                    if (compare_result === true) {
                        req.session.isLoggedIn = true;
                        req.session.userID = rows[0].id;

                        res.redirect('/');
                    }
                    else {
                        res.render('login', {
                            age: 0,
                            login_errors: ['Invalid Password!']
                        });
                    }
                })
                    .catch(err => {
                        if (err) throw err;
                    });


            }).catch(err => {
                if (err) throw err;
            });
    }
    else {
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // REDERING login-register PAGE WITH LOGIN VALIDATION ERRORS
        // console.log(allErrors);
        res.render('login', {
            age: 0,
            login_errors: allErrors
        });
    }
});

app.post('/register',
    // post data validation(using express-validator)
    [
        body('user_email', 'Invalid email address!').isEmail().custom((value) => {
            return dbConnection.execute('SELECT `email` FROM `userDetail` WHERE `email`=?', [value])
                .then(([rows]) => {

                    if (rows.length > 0) {

                        return Promise.reject('This E-mail already in use!');
                    }
                    return true;
                });
        }), body('user_tell', 'tell is Empty!').trim().not().isEmpty(),
        body('user_name', 'Username is Empty!').trim().not().isEmpty(),
        body('user_pass', 'The password must be of minimum length 6 characters').trim().isLength({ min: 6 }),
    ],// end of post data validation
    (req, res, next) => {

        const validation_result = validationResult(req);
        const { user_name, user_lastname, user_pass, user_email, user_tell } = req.body;
        // console.log(req.body);
        // IF validation_result HAS NO ERROR
        if (validation_result.isEmpty()) {
            // password encryption (using bcryptjs)
            bcrypt.hash(user_pass, 12).then((hash_pass) => {
                // INSERTING USER INTO DATABASE
                dbConnection.execute("INSERT INTO `userDetail`(`name`,`lastname`,`email`,`password`,`tell`) VALUES(?,?,?,?,?)", [user_name, user_lastname, user_email, hash_pass, user_tell])
                    .then(result => {
                        res.render('login', {
                            age: 0
                        });
                    }).catch(err => {
                        // THROW INSERTING USER ERROR'S
                        if (err) throw err;
                    });
            })
                .catch(err => {
                    // THROW HASING ERROR'S
                    if (err) throw err;
                })
        }
        else {
            // COLLECT ALL THE VALIDATION ERRORS
            let allErrors = validation_result.errors.map((error) => {
                return error.msg;
            });
            // REDERING login-register PAGE WITH VALIDATION ERRORS
            res.render('register', {
                age: 0,
                register_error: allErrors,
                old_data: req.body
            });
        }
    });// END OF REGISTER PAGE
    app.post('/map', (req, res,next) => {
        console.log("map"); 
        const validation_result = validationResult(req);
        const { check=0 } = req.body;
        console.log("CHECK : %s",check);
        if (validation_result.isEmpty()) {
        dbConnection.execute("SELECT * FROM `touristAttractionDetail` WHERE `TID`= ?",[check]).then(([rows]) => {
           // console.log([rows]);
            console.log(rows[0].region);
            res.render('map', {
                name: name_is,
                age: session_mode,
                region: rows[0].region,
                province: rows[0].province,
                contactNumber: rows[0].contactNumber,
                touristSpot: rows[0].touristSpot,
                highSeason:rows[0].highSeason,
                signatureFood:rows[0].signatureFood,
                vimages:rows[0].vimages
  
            });
        });
        }
    });
    
///////////////////////////END POST ///////////////////////////////////////////////
app.use('/', (req, res) => {
    res.status(404).send('<h1>404 Page Not Found!</h1>');
});
app.listen(port, function (err) {
    if (err) console.log(err);
    console.log("Server listening on %s", port);
});