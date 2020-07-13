const express = require("express");

const WizardController = require("../controllers/wizard");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("/signup", WizardController.createWizard);

router.post("/login", WizardController.wizardLogin);

router.post("/resetpassword", WizardController.resetPassword);

router.post("/setNewPassword", WizardController.setNewPassword);

router.put("/profile/:id", checkAuth,  WizardController.updateProfile);

router.get("/profile/:id",   WizardController.getProfile);

router.post("/validatewizard/:id", WizardController.validateWizard);

router.get("/sendPWEmail/:id", WizardController.sendPWEmail)

router.post("/validatePWReset/:id", WizardController.validatePWReset)

router.post("/deleteWizard", WizardController.deleteWizard)

module.exports = router;
