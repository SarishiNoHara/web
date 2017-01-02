var express = require('express'),
    controller = require('./controllers/controller');

var app = express();

app.set('view engine', 'ejs');

//handle static files(css, js) map files in assets to /
app.use(express.static('./public/assets'));

//fire app
controller.route(app);
controller.database(app);
controller.configuration(app);

//set listening port
app.listen(3000);
console.log('server has started in port 3000');