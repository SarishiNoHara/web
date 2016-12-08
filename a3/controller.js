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
var colors = require('colors');

module.exports = function(app) {

    app.get('/todos', function(req, res) {
        // console.log(req.query);
        res.render('todos', { ejstodos: todo, ejsdone: done });

    });

    //handle a done item to todo item
    app.post('/done/:id', urlencodedParser, function(req, res) {
        var i = req.params.id;
        console.log("done ---> todo: ".cyan, req.body);
        todo.push(req.body);
        done.splice(i, 1);
        for (var a of todo) {
            console.log('after checked,', 'todo list'.red, 'have:', a);
        }
        for (var a of done) {
            console.log(', and', 'done list'.blue, 'have:', a);
        }
        res.redirect('/todos');
    })

    //handle a todo item to done item
    app.post('/todo/:id', urlencodedParser, function(req, res) {
        var i = req.params.id;
        console.log('todo ---> done: '.cyan, req.body);
        done.push(req.body);
        todo.splice(i, 1);
        for (var a of done) {
            console.log('after checked,', 'done list'.blue, 'have:', a);
        }
        for (var a of todo) {
            console.log(', and', 'todo list'.red, 'have:', a);
        }
        res.redirect('/todos');
    })

    //delete an item in todo list
    app.post('/delete/todo/:id', function(req, res) {
        var i = req.params.id;
        //res.send(req.params.id);
        console.log('delete:'.cyan, todo[i]);
        todo.splice(i, 1);
        res.redirect('/todos');
        // res.render('todos', { ejstodos: todo, ejsdone: done });
        for (var i of todo) {
            console.log('message remain in', 'todo list:'.red, i);
        }
    })

    //update an item in todo list
    app.post('/update/todo/:id', urlencodedParser, function(req, res) {
        var i = req.params.id;
        todo[i] = req.body;
        console.log("update an item: ".cyan, todo[i]);
        for (var m of todo) {
            console.log('after update,', 'todo list'.red, 'have:', m);
        }
        res.redirect('/todos');
    })

    //delete an item in done list
    app.post('/delete/done/:id', function(req, res) {
        var i = req.params.id;
        //res.send(req.params.id);
        console.log('delete:'.cyan, done[i]);
        done.splice(i, 1);
        res.redirect('/todos');
        // res.render('todos', { ejstodos: todo, ejsdone: done });
        for (var i of done) {
            console.log('message remain in', 'done list:'.blue, i);
        }
    })

    //update an item in done list
    app.post('/update/done/:id', urlencodedParser, function(req, res) {
        var i = req.params.id;
        done[i] = req.body;
        console.log("update an done item: ".cyan, done[i]);
        for (var m of done) {
            console.log('after update,', 'done list'.blue, 'have:', m);
        }
        res.redirect('/todos')
    })

    //add a new item in todo list
    app.post('/todos', urlencodedParser, function(req, res) {
        console.log('add a new item:'.cyan, req.body);
        todo.push(req.body);
        for (var i of todo) {
            console.log('after add,', 'todo list'.red, 'have:', i);
        }
        //  res.json(todo);

        res.redirect('/todos');
    });


}