var express = require('express');
var router = express();
var models = require('../models');
var Page = models.Page;
var User = models.User;
var Promise = require('bluebird');


router.get('/', function(req, res) {
    Page.findAll().then(function(data) {
        //res.json(data);
        res.render('index', { data: data });
    });
});

router.get('/search', function(req, res) {
    res.render('search');
});

router.post('/search/', function(req, res) {
    var tags = req.body.tags;
    Page.findAll({
        where: {
            tags: {
                $contains: [tags]
            }
        }
    }).then(function(pages) {
        res.render('index', { data: pages });
    });
});

router.post('/', function(req, res, next) {
    var title = req.body.title;
    var content = req.body.content;
    var tags = req.body.tags.split(' ');

    var author = req.body.name;
    var email = req.body.email;



    User.findOrCreate({
        where: {
            name: author,
            email: email
        }
    }).then(function(values) {
        //console.log(values);
        var user = values[0];

        var page = Page.build({
            title: title,
            content: content,
            tags: tags
        });

        page.save().then(function() {
            //console.log('page', page);
            return page.setAuthor(user);
        }).then(function(page) {
            res.redirect(page.get('urlTitle'));
        }).catch(next);
    });
});

router.get('/add', function(req, res) {
    res.render('addpage');
});


router.get('/users', function(req, res) {

    User.findAll({})
        .then(function(users) {
            //res.json(users);
            res.render('users', { users: users });
        });


});

router.get('/users/:id', function(req, res) {
    var id = req.params.id;

    var userPromise = User.findById(id);
    var pagePromise = Page.findAll({
        where: {
            authorId: id,
        }
    });

    Promise.all([
        userPromise,
        pagePromise
    ])


    .then(function(values) {
        //res.json(values);
        res.render('userpage', {
            pages: values[1],
            user: values[0]
        });
    })


    .catch(function(err) {
        console.log(err);
    });



});


router.get('/:urlTitle', function(req, res) {
    // var storedPage;
    // Page.findOne({
    //     where: {
    //         urlTitle: req.params.urlTitle
    //     }
    // }).then(function(page) {
    //     //res.send(page);
    //     storedPage = page;
    //     //userid = page.authorId;
    //     return User.findOne({
    //     	where: {
    //     		id: storedPage.authorId
    //     	}
    //     });
    //     //res.render('wikipage', { page: page });
    // }).then(function(user) {
    // 	//res.json(storedPage);
    // 	res.render('wikipage', { user: user, pages: storedPage});
    // });
    var storedPage;
    Page.findOne({
        where: {
            urlTitle: req.params.urlTitle
        }
    }).then(function(page) {
        //res.send(page);
        storedPage = page;
        //userid = page.authorId;
        return page.getAuthor();
        //res.render('wikipage', { page: page });
    }).then(function(user) {
        //res.json(storedPage);
        storedPage.tags = storedPage.tags.join(" ");
        res.render('wikipage', { user: user, pages: storedPage });
    });
});

//error handling for .catch(next)
router.get(function(err, req, res, next) {
    res.render('error', { error: err });
});


module.exports = {
    router: router
};
