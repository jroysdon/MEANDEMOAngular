const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const Wizard = require("../models/wizard");
const Post = require("../models/post");
const WizardProfile = require("../models/wizardProfile");
const { isExportSpecifier } = require("typescript");
const { Console } = require("console");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
}
});

function makeId(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

exports.sendPWEmail = (req, res, next) => {
  let fetchedWizard;
  var date = new Date();
  var expDate = date.addDays(1);
  const verificationCode = makeId(32);
  Wizard.findOne({ email: req.params.id})
  .then(wizard => {
    if (!wizard) {
      return res.status(400).json({
        message: "Email: Not Found"
      });
    }
    fetchedWizard = wizard;
    fetchedWizard.verificationCode = verificationCode;
    fetchedWizard.verificationCodeExpires = expDate;
    fetchedWizard.save()
    .then(result => {
//      console.log("connecting to mailserver: " + process.env.SMTP_SERVER + ": port " + process.env.SMTP_PORT)
      const mailOptions = {
        from: 'validate@pixieproductions.com',
        to: req.params.id,
        subject: 'Neverest: Password Reset Request', // Subject line
        html: '<p>A request has been made to reset your password. If you made this request, click this <a href="http://localhost:4200/resetpwd/' + verificationCode +'"> Verification Link </a> to reset your password.</p><p> Otherwise just ignore it and log in at your convenience.</p>'
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log("Error: " + err)
        else
          console.log( info)
        }
     );
      return res.status(200).json({
        state: 200,
        message: "Password Email Sent"
      });
    });
  })
  .catch(err => {
    console.log ('Error:' + err);
    return res.status(402).json({
      message: "Validation code not found!"
    });
  });
};

exports.validatePWReset = (req, res, next) => {
  let fetchedWizard;
  Wizard.findOne({ verificationCode: req.params.id})
  .then(wizard => {
    if (!wizard) {
      return res.status(400).json({
        message: "Verification Code: Not Found"
      });
    }
    fetchedWizard = wizard;
    if (Date.now() > fetchedWizard.verificationCodeExpires){
        return res.status(401).json({
          message: "Validation Code: Expired"
        });
    } else {
      return res.status(200).json({
        state: 200,
        message: fetchedWizard.email
      });
  }
 })
  .catch(err => {
    console.log ('Error:' + err);
    return res.status(402).json({
      message: "Validation code not found!"
    });
  });

};

exports.validateWizard = (req, res, next) => {
  let fetchedWizard;
  //console.log  ('Searching for: ' + req.params.id);
  Wizard.findOne({ verificationCode: req.params.id})
    .then(wizard => {
      if (!wizard) {
        return res.status(400).json({
          message: "Verification Code: Not Found"
        });
      }
      fetchedWizard = wizard;
      if (Date.now() > fetchedWizard.verificationCodeExpires){
          return res.status(401).json({
            message: "Validation Code: Expired"
          });
      } else {
        fetchedWizard.verified = true;
        fetchedWizard.verificationCode = '';
        fetchedWizard.verificationCodeExpires = null;
        fetchedWizard.save();
        return res.status(200).json({
          state: 200,
          message: "Validation Code: Verified"
        });

    }
   })
    .catch(err => {
      console.log ('Error:' + err);
      return res.status(402).json({
        message: "Validation code not found!"
      });
    });

}

exports.resetPassword = (req, res, next) => {

  let fetchedWizard;
  Wizard.findOne({ verificationCode: req.body.validationCode })
    .then(wizard => {
      if (!wizard) {
        return res.status(401).json({
          message: "User Not Found"
        });
      }
      fetchedWizard = wizard;
      bcrypt.hash(req.body.password, 10).then(hash => {
        fetchedWizard.verificationCode = '';
        fetchedWizard.verificationCodeExpires = null;
        fetchedWizard.password = hash;
        fetchedWizard.save()
        .then(result => {
          return res.status(200).json({
            message: "Password Reset",
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            message: "Invalid authentication credentials!"
          });
        });
    });
  })
 }

exports.createWizard = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    var date = new Date();
    var expDate = date.addDays(1);
    const verificationCode = makeId(32);

    const wizard = new Wizard({
      email: req.body.email,
      password: hash,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      dob: req.body.dob,
      verified: false,
      verificationCode: verificationCode,
      verificationCodeExpires: expDate,
      signupDate: Date.now()

    });
    wizard
      .save()
      .then(result => {
        const mailOptions = {
          from: 'validate@pixieproductions.com',
          to: req.body.email,
          subject: 'Neverest: Verify your email', // Subject line
          html: '<p>We need to verify your email: Click this <a href="http://localhost:4200/validate/' + verificationCode +'">Verification Link</a> to validate your email and your account.</p>'
        };
        transporter.sendMail(mailOptions, function (err, info) {
          if(err)
            console.log("Error: " + err)
          else
            console.log( info)
       });
        res.status(201).json({
          message: "Wizard created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Invalid authentication credentials!"
        });
      });
  });
}

exports.wizardLogin = (req, res, next) => {
  let fetchedWizard;
  Wizard.findOne({ email: req.body.email })
    .then(wizard => {
      if (!wizard) {
        return res.status(401).json({
          message: "User Not Found"
        });
      }
      fetchedWizard = wizard;
      if (!wizard.verified) {
        //console.log('User Not Verified');
        return res.status(402).json({
          message: "User Not Validated"
        });
      }
      return bcrypt.compare(req.body.password, wizard.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedWizard.email, wizardId: fetchedWizard._id },
        process.env.JWT_KEY,
        { expiresIn: "6h" }
      );
      if(fetchedWizard.verified && fetchedWizard.verificationCode != "") {
        fetchedWizard.verificationCode = ""
        fetchedWizard.verificationCodeExpires = null
      }
      fetchedWizard.lastLogin = Date.now();
      fetchedWizard.save();
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        wizardId: fetchedWizard._id
      });
    })
}

exports.getProfile = (req, res, next) => {
    if (req.params.id === null){
      throw (error)
    }
      WizardProfile.findById(req.params.id, 'email verified firstname lastname dob lastLogin signupDate')
      .then(wizard => {
        if (wizard) {
          res.status(200).json(wizard);
        } else {
          res.status(404).json({ message: "Profile not found!" });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Fetching profile failed!"
        });
      });
}

 exports.updateProfile = (req,res,next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const wizard = new Wizard({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.wizardData.wizardId
  });
  Post.updateOne({ _id: req.params.id, creator: req.wizardData.wizardId }, wizard)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate profile!"
      });
    });
}

exports.setNewPassword = (req, res, next) => {

  let fetchedWizard;
  Wizard.findOne({ _id: req.body.tokenID })
    .then(wizard => {
      if (!wizard) {
        return res.status(401).json({
          message: "User Not Found"
        });

      }
      fetchedWizard = wizard;

    return bcrypt.compare(req.body.password, wizard.password);
  })
  .then(result => {
    if (!result) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
      bcrypt.hash(req.body.newPassword, 10).then(hash => {
        fetchedWizard.password = hash;
        fetchedWizard.save()
        .then(result => {
          return res.status(200).json({
            message: "Password Reset",
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            message: "Invalid authentication credentials!"
          });
        });
    });
  })
}

exports.deleteWizard = (req,res,next) => {
  Wizard.findOne({ _id: req.body.profileID })
    .then(wizard => {
      if (!wizard) {
        return res.status(401).json({
          message: "User Not Found"
        });

      }
      fetchedWizard = wizard;
    return bcrypt.compare(req.body.password, wizard.password);
  })
  .then(result => {
    if (!result) {
      return res.status(401).json({
        message: "Sorry, that is not your password"
      });
    }
      if (req.body.deleteContent){
        // console.log('Deleting Posts')
        Post.deleteMany({ creator: req.body.profileID}, function (err) {
            if(err) console.log(err);
            // console.log("Successful deletion");
          });
      }
      // console.log('Deleteing account: ' + req.body.profileID)
        Wizard.deleteOne({ _id: req.body.profileID }, function (err) {
          if(err) console.log(err);
          // console.log("Successful deletion");
        });
    return res.status(400).json({
      message: "User Deleted called",
      //result: result
    });
 
  })

}