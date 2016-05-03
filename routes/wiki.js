var express = require('express');
var router = express();
var models = require('../models');
var Page = models.Page;
var User = models.User;


router.get('/', function(req, res) {
	Page.findAll().then(function(data) {
		//res.json(data);
		res.render('index', { data: data } );
	});
});

router.post('/', function(req, res, next) {
	var title = req.body.title;
	var content = req.body.content;

	var author = req.body.name;
	var email = req.body.email;



	User.findOrCreate({
		where: { 
			name: author,
			email: email
		}
	}).then(function(values){
		var user = values[0];

		var page = Page.build({
			title: title,
			content: content
		});

		page.save().then(function(something){
			return page.setAuthor(user);
		}).then(function(page){
			res.redirect(page.get('urlTitle'));
		}).catch(next);
	});
});

router.get('/add', function(req, res){
	res.render('addpage');
});

router.get('/:urlTitle', function(req, res) {
	Page.findOne({
		where: {
			urlTitle: req.params.urlTitle
		}
	}).then(function(page) {
		//res.send(page);
		res.render('wikipage',{page: page});
	});
});




module.exports = {
	router: router
};