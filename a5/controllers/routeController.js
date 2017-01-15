var mysql = require('mysql');
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var path = require('path');
var cookies = require('cookie-parser');
var passport = require("passport");
var Strategy = require("passport-twitter").Strategy;
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'todo',
})

function route(app) {

    app.use(require('morgan')('combined'));
    app.use(require('cookie-parser')());
    app.use(require('body-parser').urlencoded({ extended: true }));
    app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

    app.use(passport.initialize());
    app.use(passport.session());

    var env = require('../env');

    passport.use(new Strategy({
            consumerKey: env.twitter.consumerKey,
            consumerSecret: env.twitter.consumerSecret,
            callbackUrl: env.twitter.callbackURL
        },
        function(token, tokenSecret, profile, cb) {
            return cb(null, profile);
        }
    ));

    passport.serializeUser(function(user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function(obj, cb) {
        cb(null, obj);
    });

    app.get('/auth/twitter',
        passport.authenticate('twitter'));

    app.get('/auth/twitter/return',
        passport.authenticate('twitter', { failureRedirect: '/' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/index');
        });

    app.get('/splash[a-z]?', function(req, res) {
        res.sendFile(path.join(__dirname, '../views/splash.html'));
    });

    app.get('/index|list[t]?odos[s]?', function(req, res) {
        connection.query('select * from todos where userId=?', req.user.id, function(err, result) {
            var todos = JSON.parse(JSON.stringify(result));
            if (err) throw err;
            res.render('index', { ejstodo: todos, user: req.user.username });
        })
    })

    app.get('/analyse[s]?', function(req, res) {
        res.sendFile(path.join(__dirname, '../views/analyse.html'));
    })

    app.get('*', function(req, res) {
        res.send('404 not found', 404);
    });

}

module.exports = {
    route: route
}