var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false
});

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
}, {
    hooks: {
        beforeValidate: function(page, options) {
            page.urlTitle = cat(page.title)
        }
    }

}, {
    instanceMethods: {

        route: function() {
               return this.urlTitle;
        }
    }
   });

var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        isEmail: true
    }
});

function cat(title) {
    if (title) {
        return title.replace(/[\W]+/g, '').replace(/[\s]+/g, '_')
    } else {
        return Math.random().toString(36).substring(2, 7);
    }
}

module.exports = {
    Page: Page,
    User: User
};
