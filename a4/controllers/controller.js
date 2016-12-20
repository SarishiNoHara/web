var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var path = require('path');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'todolist',
})

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '../views/splash.html'));
    });

    app.get('/index', function(req, res) {
        res.sendFile(path.join(__dirname, '../views/index.html'));
    })

    //     app.get('/analyse', fucntion(req, res) {
    // res.sendFile(path.join(__dirname, '../views/index.html'));
    //     })

    app.get('/todo', function(req, res) {
        connection.query('select * from todolist', function(err, result) {
            var todos = JSON.parse(JSON.stringify(result));
            res.json(todos);
        })
    });

    app.post('/todo', urlencodedParser, function(req, res) {
        var item = {
            message: req.body.message,
            date: req.body.date,
            rating: req.body.rating,
            completed: false,
        };

        var query = connection.query('insert into todolist set ?', item, function(err, result) {
            console.log(query);
        })

        res.sendStatus(200);
    })


    app.delete('/todo/delete/:id', urlencodedParser, function(req, res) {
        var id = req.params.id;

        var query = connection.query('delete from todolist where id=?', id, function(err, result) {
            console.log(query);
        })

        res.send("delete todo");
    });

    app.put('/todo/update/:id', urlencodedParser, function(req, res) {
        var id = req.params.id,
            message = req.body.message,
            date = req.body.date,
            rating = req.body.rating;

        var query = connection.query('update todolist set message=?, date=?, rating=? where id=?', [message, date, rating, id],
            function(err, result) {
                console.log(query);
            })

        res.send('update todo');
    });

    app.put('/todo/completed/:id', urlencodedParser, function(req, res) {
        var id = req.params.id;

        var query = connection.query('update todolist set completed=true where id=?', id, function(err, result) {

        });

        res.send('completed!');
    });

    app.put('/todo/incomplete/:id', urlencodedParser, function(req, res) {
        var id = req.params.id;

        var query = connection.query('update todolist set completed=false where id=?', id, function(err, result) {

        });
        res.send('incomplete!');
    });

}