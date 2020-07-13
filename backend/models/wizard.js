const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const wizardSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstname: {type: String},
  lastname: {type: String},
  dob: {type: Date},
  lastLogin: {type: Date},
  verified: { type: Boolean},
  verificationCode: {type: String},
  verificationCodeExpires:  {type: Date},
  signupDate: {type: Date}
});

wizardSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Wizard", wizardSchema, 'wizards');
