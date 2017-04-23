const express = require('express');
const router  = express.Router();

// Controllers
const users = require('../controllers/users');

router.get('/', (req, res) => res.render('statics/home'));

router.route('/users')
  .get(users.index)
  .post(users.create);
router.route('/users/new')
  .get(users.new);
router.route('/users/:id')
  .get(users.show);
router.route('/users/:id/edit')
  .get(users.edit);

module.exports = router;
