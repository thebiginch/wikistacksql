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
        allowNull: false,
        get: function() {
            return '/wiki/' + this.getDataValue('urlTitle');
        }
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
    tags: {
        type: Sequelize.ARRAY(Sequelize.STRING)
    }
    // route: {
    //     type: Sequelize.STRING,
    //     allowNull: false
    // }
}, {
    hooks: {
        beforeValidate: function(page, options) {
            page.urlTitle = cat(page.title);
        }
    }
}, {
    getterMethods: {
        route: function(page) {
            return '/wiki/' + page.urlTitle;
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

Page.belongsTo(User, { as: 'author' });


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
