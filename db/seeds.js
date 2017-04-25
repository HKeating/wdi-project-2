const mongoose    = require('mongoose');
mongoose.Promise  = require('bluebird');
const env         = require('../config/env');

const User        = require('../models/user');
// const Journey     = require('../models/journey');

// const databaseURL = 'mongodb://localhost/wdi-project-2';
mongoose.connect(env.db, () => {
  console.log('Connected');
});


User.collection.drop();

User
  .create([
    {
      name: 'Horace',
      email: 'horace@horace.com',
      password: 'blah',
      passwordConfirmation: 'blah',
      journeys: [{
        name: 'testing',
        origin: 'home',
        destination: 'work'
      }, {
        name: 'testing2',
        origin: 'home2',
        destination: 'work2'
      }]
    },
    {
      name: 'Helly',
      email: 'helly@helly.com',
      password: 'bleh',
      passwordConfirmation: 'bleh'
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
