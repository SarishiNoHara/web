var express = require('express');
controller = require('./controller');

var app = express();

//app.set('view engine', 'ejs');

//handle static files(css, js)
app.use(express.static('.'));

//fire app
controller(app);

//set listening port
app.listen(3000);
console.log('server has started in port 3000');