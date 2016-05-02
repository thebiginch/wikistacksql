var express = require('express');
var router = express();
var models = require('../models');
var Page = models.Page;
var User = models.User;


router.get('/', function(req, res) {
	res.redirect('/')
});

router.post('/', function(req, res, next) {
	var title = req.body.title;
	//var urlTitle = title.replace(/[\W]+/g, '').replace(/[\s]+/g, '_');
	var content = req.body.content;

	var page = Page.build({
		title: title,
		content: content
	});

	page.save().then(function(){
		res.redirect('/');
	});

});

router.get('/add', function(req, res){
	res.render('addpage');
});





module.exports = {
	router: router
};
