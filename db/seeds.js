const mongoose   = require('mongoose');
mongoose.Promise = require('bluebird');

const databaseURL = 'mongodb://localhost/wdi-project-2';
mongoose.connect(databaseURL);
