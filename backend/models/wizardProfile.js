const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const wizardSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstname: {type: String},
  lastname: {type: String},
  dob: {type: Date},
  dob: { type: Date},
  lastLogin: {type: Date},
  signupDate: {type: Date}
    // name: {type: String},
  // phone: { type: String},
  // verified: {type: Boolean},
  // alias: { type: String},
  // gender: {type:String},
  // city: {type: String},
  // state: {type: String},
  // zipcode: {type: String},
  // country: {type: String},
  // createdDate: {type: Date, default: Date.now},
  // lastLogin: {type: Date},
  // currentLevel: {type: Number},
  // maxLevel: {type: Number},
  // currentManna: {type: Number},
  // maxManna: {type: Number},
  // currentKarma: {type: Number},
  // maxKarma: {type: Number},
  // concentration: {type: Number},
  // spirit: {type: Number},
  // xp: {type: Number},
  // alignment: {type: String},
  // currentMountain: {type: String},
  // school: {type: String}, 
  // avatarFile: {type: String}
});

wizardSchema.plugin(uniqueValidator);

module.exports = mongoose.model("WizardProfile", wizardSchema, 'wizards');
