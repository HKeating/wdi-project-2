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
      image: 'https://scontent.flhr3-1.fna.fbcdn.net/v/t1.0-1/p320x320/10432989_10153638017387575_814915425786401046_n.jpg?oh=860c83119e2e5819011c4329a322d123&oe=598697FE',
      journeys: [{
        name: 'GA to home',
        origin: 'General Assembly',
        destination: '35 Highbury Park'
      }, {
        name: 'Home to GA',
        origin: '35 Highbury Park',
        destination: 'General Assembly'
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
