const mongoose    = require('mongoose');
mongoose.Promise  = require('bluebird');
// const env = require('../config/env');

const User        = require('../models/user');

const databaseURL = 'mongodb://localhost/wdi-project-2';
mongoose.connect(databaseURL, () => {
  console.log('Connected');
});


User.collection.drop();

User
  .create([
    {
      name: 'Horace',
      email: 'horace@horace.com',
      password: 'blah'
    },
    {
      name: 'Helly',
      email: 'helly@helly.com',
      password: 'bleh'
    }
  ])
    .then(users => {
      console.log(`${users.length} users were created`);
    })
    .catch(err => {
      console.log(`Error: ${err}`);
    })
    .finally(() => {
      mongoose.connection.close();
    });
