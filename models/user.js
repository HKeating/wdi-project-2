const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const journeySchema = require('../models/journey');
const Journey = mongoose.model('Journey');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String, trim: true },
  journeys: [Journey.schema]
});

userSchema
  .virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation;
  });

userSchema.pre('validate', function checkPassword(next) {
  if (this.isModified('password') && (this._passwordConfirmation !== this.password)) this.invalidate('passwordConfirmation', 'Invalid combination');
  next();
});

userSchema.pre('save', function hashPassword(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
  }
  next();
});

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
