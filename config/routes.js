const express                     = require('express');
const router                      = express.Router();

// Controllers
const registrationsController     = require('../controllers/registrations');
const sessionsController          = require('../controllers/sessions');
const usersController             = require('../controllers/users');
const journeysController          = require('../controllers/journeys');
const podcastsController          = require('../lib/test');

function secureRoute(req, res, next) {
  if (!req.session.userId) {
    return req.session.regenerate(() => {
      req.flash('danger', 'You must be logged in to view that...');
      res.redirect('/login');
    });
  }
  next();
}

router.get('/', (req, res) => res.render('statics/home'));

router.route('/users')
  .get(secureRoute, usersController.index)
  .post(secureRoute, usersController.create);
router.route('/users/new')
  .get(secureRoute, usersController.new);
router.route('/users/:id')
  .get(secureRoute, usersController.show)
  .put(secureRoute, usersController.update)
  .delete(secureRoute, usersController.delete);
router.route('/users/:id/edit')
  .get(secureRoute, usersController.edit);
router.route('/register')
  .get(registrationsController.new)
  .post(registrationsController.create);
router.route('/login')
  .get(sessionsController.new)
  .post(sessionsController.create);
router.route('/logout')
  .get(secureRoute, sessionsController.delete);
router.route('/journeys')
  .get(secureRoute, journeysController.new)
  .post(secureRoute, journeysController.create);
router.route('/journeys/:id')
  .delete(secureRoute, journeysController.delete);
router.route('/search')
  .post(secureRoute, podcastsController.search);


module.exports = router;
