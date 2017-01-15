var mysql = require('mysql');
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var path = require('path');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'todo',
})

function database(app) {

    app.get('/todo[s]?', urlencodedParser, function(req, res) {
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

module.exports = {
    database: database
}