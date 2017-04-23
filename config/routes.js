const express = require('express');
const router  = express.Router();

// Controllers
const usersController = require('../controllers/users');
const sessionsController = require('../controllers/sessions');

router.get('/', (req, res) => res.render('statics/home'));

router.route('/users')
  .get(usersController.index)
  .post(usersController.create);
router.route('/users/new')
  .get(usersController.new);
router.route('/users/:id')
  .get(usersController.show)
  .put(usersController.update)
  .delete(usersController.delete);
router.route('/users/:id/edit')
  .get(usersController.edit);
router.route('/login')
  .get(sessionsController.new)
  .post(sessionsController.create);
router.route('/logout')
  .get(sessionsController.delete);


module.exports = router;
