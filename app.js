var express = require('express');
var server = express();
var models = require('./models');
var wiki = require('./routes/wiki');
var swig = require('swig');
var morgan = require('morgan');
var bodyParser = require ('body-parser');
var path  = require('path');

server.set('views', path.join(__dirname, '/views'));
server.set('view engine', 'html');
server.engine('html', swig.renderFile);
swig.setDefaults({cache: false});

server.use(express.static('./public'));

server.use(morgan('dev'));
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

server.use('/wiki', wiki.router);

models.User.sync({force: true}).then (function() {
	return models.Page.sync({force: true});
}).then(function(){
	server.listen(3000, function() {
		console.log('We are listneing on Port 3000!')
	});
}).catch(console.error);