var todo = [];
var t1 = { message: "shopping", date: "12/12/2016", rating: 5 };
var t2 = { message: "coding", date: "1/12/2016", rating: 4 };
var t3 = { message: "travelling", date: "1/15/2016", rating: 3 };
todo.push(t1);
todo.push(t2);
todo.push(t3);

var done = [];
var t1 = { message: "walk dog", date: "12/12/2016", rating: 5 };
var t2 = { message: "sleep", date: "1/12/2016", rating: 4 };
var t3 = { message: "study for test", date: "1/15/2016", rating: 3 };
done.push(t1);
done.push(t2);
done.push(t3);

var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
module.exports = function(app) {

    app.get('/todos', function(req, res) {
        // console.log(req.query);
        res.render('todos', { ejstodos: todo, ejsdone: done });

    });

    app.post('/todos', urlencodedParser, function(req, res) {
        console.log(req.body);
        todo.push(req.body);
        for (var i of todo) {
            console.log("hello " + i.message);
        }

        res.render('todos', { ejstodos: todo, ejsdone: done });
    });


}