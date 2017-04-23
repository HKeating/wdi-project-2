const User = require('../models/user');

function usersIndex(req, res) {
  User
    .find()
    .exec()
    .then(users => {
      return res.render('users', { users });
    })
    .catch(err => {
      return res.render('error', { error: err });
    });
}

function usersShow(req, res) {
  User
    .findById(req.params.id)
    .exec()
    .then(user => {
      if (!user) {
        return res.render('error', { error: 'No user found' });
      }
      return res.render('users/show', { user });
    })
    .catch(err => {
      return res.render('error', { error: err });
    });
}

function usersNew(req, res) {
  return res.render('users/new');
}

function usersCreate(req, res) {
  User
    .create(req.body)
    .then(user => {
      if (!user) return res.render('error', { error: 'No user registered' });
      return res.redirect('/users');
    })
    .catch(err => {
      return res.render('error', { error: err });
    });
}

function usersEdit(req, res) {
  User
    .findById(req.params.id)
    .exec()
    .then(user => {
      if (!user) {
        return res.render('error', { error: 'No user found'});
      }
      return res.render('users/edit', { user });
    })
    .catch(err => {
      return res.render('error', { error: err });
    });
}

module.exports = {
  index: usersIndex,
  show: usersShow,
  new: usersNew,
  create: usersCreate,
  edit: usersEdit
};
