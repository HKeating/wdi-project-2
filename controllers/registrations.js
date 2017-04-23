const User = require('../models/user');



function newUser(req, res) {
  res.render('users/new');
}

function createUser(req, res) {
  User
    .create(req.body)
    .then(() => {
      req.flash('info', 'Thanks for registering! Please log in');
      res.redirect('/login');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.redirect('/register');
      }
      res.status(500).end();
    });
}


module.exports = {
  new: newUser,
  create: createUser
};
