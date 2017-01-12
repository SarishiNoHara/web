var mysql = require('mysql');
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var path = require('path');
var cookies = require('cookie-parser');
var credentials = require("../credentials");
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

    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '../views/splash.html'));
    });

    app.get('/index', function(req, res) {
        connection.query('select * from todos where userId=?', req.user.id, function(err, result) {
            var todos = JSON.parse(JSON.stringify(result));
            if (err) throw err;
            res.render('index', { ejstodo: todos, user: req.user.username });
        })
    })

    app.get('/analyse', function(req, res) {
        res.sendFile(path.join(__dirname, '../views/analyse.html'));
    })

}

function database(app) {

    app.get('/todo', urlencodedParser, function(req, res) {
        connection.query('select * from todos', function(err, result) {
            var todos = JSON.parse(JSON.stringify(result));
            res.json(todos);
        })
    })

    app.post('/todo', urlencodedParser, function(req, res) {
        var item = {
            message: req.body.message,
            date: req.body.date,
            rating: req.body.rating,
            completed: false,
            userId: req.user.id,
            userName: req.user.username
        };

        var query = connection.query('insert into todos set ?', item, function(err, result) {})
        res.send("add success");
    })


    app.delete('/todo/delete/:id', urlencodedParser, function(req, res) {
        var id = req.params.id;

        connection.query('delete from todos where id=?', id, function(err, result) {})

        res.send("delete todo");
    });

    app.put('/todo/update/:id', urlencodedParser, function(req, res) {
        var id = req.params.id,
            message = req.body.message,
            date = req.body.date,
            rating = req.body.rating;

        connection.query('update todos set message=?, date=?, rating=? where id=?', [message, date, rating, id],
            function(err, result) {})

        res.send('update todo');
    });

    app.put('/todo/completed/:id', urlencodedParser, function(req, res) {
        var id = req.params.id;

        connection.query('update todos set completed=true where id=?', id, function(err, result) {

        });

        res.send('completed!');
    });

    app.put('/todo/incomplete/:id', urlencodedParser, function(req, res) {
        var id = req.params.id;

        var query = connection.query('update todos set completed=false where id=?', id, function(err, result) {

        });
        res.send('incomplete!');
    });
}

function configuration(app) {
    app.get('/q1', function(req, res) {
        // select User.name, ToDoList.Id , ToDoList.Name as todolist 
        // from User, ToDoList  
        // where User.Id = 1;
        connection.query('select User.name, ToDoList.Id , ToDoList.Name as todolist from User, ToDoList  where User.Id = 1;',
            function(err, result) {
                var q = JSON.parse(JSON.stringify(result));
                res.json(q);
            })
    })

    app.get('/q2', function(req, res) {
        // select ToDoItem.Id, ToDoItem.Title from ToDoItem, ToDoList 
        // where ToDoList.Id = ToDoItem.ToDoListID 
        // and ToDoList.id = 1;
        connection.query('select ToDoItem.Id, ToDoItem.Title from ToDoItem, ToDoList where ToDoList.Id = ToDoItem.ToDoListID and ToDoList.id = 1;',
            function(err, result) {
                var q = JSON.parse(JSON.stringify(result));
                res.json(q);
            })
    })

    app.get('/q3', function(req, res) {
        connection.query('select ToDoItem.Id, ToDoItem.Title from ToDoItem, ToDoList where ToDoList.Id = ToDoItem.ToDoListID and ToDoList.id = 1 limit 0,10;',
            function(err, result) {
                var q = JSON.parse(JSON.stringify(result));
                res.json(q);
            })
    })
    app.get('/q4', function(req, res) {
        connection.query('SELECT * FROM todo.ToDoItem WHERE ToDoListID = 1 AND CreationDate > \'2014-09-09 00:00:00\' LIMIT 0, 10;',
            function(err, result) {
                var q = JSON.parse(JSON.stringify(result));
                res.json(q);
            })
    })
    app.get('/q5', function(req, res) {
        connection.query('select ToDoItem.title from ToDoItem where ToDoItem.ParentToDo = 1;',
            function(err, result) {
                var q = JSON.parse(JSON.stringify(result));
                res.json(q);
            })
    })
    app.get('/q6', function(req, res) {
        connection.query('select Tag.Id as tagId,Tag.Text,ToDoItem.Id as todoitemId, ToDoItem.Title from ItemTag left join Tag on Tag.Id=ItemTag.TagId left join ToDoItem on ItemTag.ToDoId=ToDoItem.Id where ToDoItem.Id = 1;',
            function(err, result) {
                var q = JSON.parse(JSON.stringify(result));
                res.json(q);
            })
    })
    app.get('/q7', function(req, res) {
        connection.query('select distinct ToDoList.Id as todolistId, ToDoList.Name as todolistName from ToDoList left join ToDoItem on ToDoList.Id=ToDoItem.ToDoListId left join ItemTag on ToDoItem.Id=ItemTag.ToDoId left join Tag on ItemTag.TagId = Tag.Id where Tag.Id = 3;',
            function(err, result) {
                var q = JSON.parse(JSON.stringify(result));
                res.json(q);
            })
    })
    app.get('/q8', function(req, res) {
        connection.query('select ToDoItem.Completed,Tag.Id, count(*) from Tag left join ItemTag on Tag.Id=ItemTag.TagId left join ToDoItem on ItemTag.TagId=ToDoItem.Id group by ToDoItem.Completed, Tag.Id;',
            function(err, result) {
                var q = JSON.parse(JSON.stringify(result));
                res.json(q);
            })
    })
    app.get('/q9', function(req, res) {
        connection.query('SELECT YEARWEEK(CompletionDate) as week, COUNT(*)  FROM todo.ToDoItem group by YEARWEEK(CompletionDate);',
            function(err, result) {
                var q = JSON.parse(JSON.stringify(result));
                res.json(q);
            })
    })
    app.get('/q10', function(req, res) {

        var string = 'select Tag.Id as tag, ToDoItem.Title as title, datediff(ToDoItem.CompletionDate,ToDoItem.CreationDate) as diff ' +
            'from Tag ' +
            'left join ItemTag ' +
            'on Tag.Id=ItemTag.TagId ' +
            'left join ToDoItem ' +
            'on ItemTag.ToDoId=ToDoItem.Id   ' +
            'where datediff(ToDoItem.CompletionDate,ToDoItem.CreationDate) is not null ' +
            'and Tag.Id = 5 ' +
            'order by datediff(ToDoItem.CompletionDate,ToDoItem.CreationDate) ASC ' +
            'limit 10;'
        connection.query(string,
            function(err, result) {
                var q = JSON.parse(JSON.stringify(result));
                res.json(q);
            })
    })
    app.get('/q11', function(req, res) {
        // connection.query('',
        //     function(err, result) {
        //         var q = JSON.parse(JSON.stringify(result));
        //         res.json(q);

        //     })
        res.json({ "text": 'i dont know' });
    })
    app.get('/q12', function(req, res) {
        connection.query('select ToDoList.Name, AVG(datediff(ToDoItem.CompletionDate,ToDoItem.CreationDate)) as avg from ToDoList left join ToDoItem on ToDoList.Id=ToDoItem.ToDoListId group by ToDoList.Name;',
            function(err, result) {
                var q = JSON.parse(JSON.stringify(result));
                res.json(q);
            })
    })
    app.get('/q13', function(req, res) {
        connection.query('select ToDoItem.ToDoListID,ToDoItem.Title, datediff(ToDoItem.CompletionDate,ToDoItem.CreationDate) as diff from ToDoItem where ToDoListID=1 having diff > ( select AVG(datediff(ToDoItem.CompletionDate,ToDoItem.CreationDate)) as avg from ToDoItem where ToDoListID=1);',
            function(err, result) {
                var q = JSON.parse(JSON.stringify(result));
                res.json(q);
            })
    })

}

module.exports = {
    route: route,
    database: database,
    configuration: configuration
}