var express = require('express'),
    routeController = require('./controllers/routeController'),
    analyseController = require('./controllers/analyseController'),
    dbController = require('./controllers/dbController');

var app = express();

app.set('view engine', 'ejs');

//handle static files(css, js) map files in assets to /
app.use(express.static('./public/assets'));

//fire app
routeController.route(app);
dbController.database(app);
analyseController.configuration(app);

//set listening port
app.listen(3000);
console.log('server has started in port 3000');