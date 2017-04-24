const express                     = require('express');
const router                      = express.Router();

// Controllers
const registrationsController     = require('../controllers/registrations');
const sessionsController          = require('../controllers/sessions');
const usersController             = require('../controllers/users');
const journeysController          = require('../controllers/journeys');
const test                         = require('../lib/test');

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
router.route('/register')
  .get(registrationsController.new)
  .post(registrationsController.create);
router.route('/login')
  .get(sessionsController.new)
  .post(sessionsController.create);
router.route('/logout')
  .get(sessionsController.delete);
router.route('/journeys')
  .get(journeysController.new)
  .post(test.search);


module.exports = router;
