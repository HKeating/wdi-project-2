const Journey = require('../models/journey');
const User = require('../models/user');


function journeysNew(req, res) {
  res.render('journeys/new');
}

function journeysCreate(req, res) {

  Journey
    .create(req.body)
    .then(journey => {
      // console.log(journey);
      if (!journey) return res.render('error', { error: 'Something went wrong with journey creation' });
      User
        .findById(req.session.userId)
        .exec()
        .then(user => {
          user.journeys.push(journey);

          user.save(err => {
            console.log(err);
          });

        });
      req.flash('info', `New journey saved`);
      res.redirect('/');
    })
    .catch(err => {
      return res.render('error', { error: err });
    });


}

// Need to fix up this function
function journeysDelete(req, res) {
  console.log('USER');
  User
  .findByIdAndUpdate({ _id: res.locals.user._id }, { $pull: { 'journeys': { _id: req.params.id } } }, { new: true })
  .exec()
  .then(() => {
    return res.redirect('/users');
  })
  .catch(err => {
    return res.render('error', { error: err });
  });
}



module.exports = {
  new: journeysNew,
  create: journeysCreate,
  delete: journeysDelete
};
