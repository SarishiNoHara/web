var todos = [];
var t1 = { id: 1, message: "shopping", date: "12/12/2016", rating: "5", completed: 0 };
var t2 = { id: 2, message: "coding", date: "1/12/2016", rating: "4", completed: 0 };
var t3 = { id: 3, message: "travelling", date: "1/15/2016", rating: "3", completed: 0 };
todos.push(t1);
todos.push(t2);
todos.push(t3);
var currentId = 3;

var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var path = require('path');
module.exports = function(app) {

    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '../views/splash.html'));
    });

    app.get('/index', function(req, res) {
        res.sendFile(path.join(__dirname, '../views/index.html'));
    })

    app.get('/todo', function(req, res) {
        res.json(todos);
    });

    app.post('/todo', urlencodedParser, function(req, res) {
        currentId++;
        todos.push({
            id: currentId,
            message: req.body.message,
            date: req.body.date,
            rating: req.body.rating,
            completed: 0,
        });
        res.sendStatus(200);
    })


    app.delete('/todo/delete/:id', urlencodedParser, function(req, res) {
        var id = req.params.id;
        todos.forEach(function(item, index) {
            if (item.id === Number(id)) {
                todos.splice(index, 1);
            }
        });
        res.send("delete todo");
    });

    app.put('/todo/update/:id', urlencodedParser, function(req, res) {
        var id = req.params.id;
        todos.forEach(function(item, index) {
            if (item.id === Number(id)) {
                item.message = req.body.message;
                item.date = req.body.date;
                item.rating = req.body.rating;
            }
        });
        res.send('updated todo');
    });

    app.put('/todo/completed/:id', urlencodedParser, function(req, res) {
        var id = req.params.id;
        todos.forEach(function(item, index) {
            if (item.id === Number(id)) {
                item.completed = 1;
            }
        });
        res.send('completed!');
    });

    app.put('/todo/incomplete/:id', urlencodedParser, function(req, res) {
        var id = req.params.id;
        todos.forEach(function(item, index) {
            if (item.id === Number(id)) {
                item.completed = 0;
            }
        });
        res.send('incomplete!');
    });

}