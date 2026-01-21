const express = require("express");
const router = express.Router();
const providerController = require("../controllers/provider.controller");
const userController = require("../controllers/user.controller");
const { validateUser } = require("../middlewares/validation.middleware");

router.post("/register", validateUser.register, providerController.register);
router.post("/register/verify-otp", validateUser.verifyOtp, userController.verifyOtp);
router.get("/verified-providers", providerController.getVerifiedProviders);
router.post("/login", validateUser.login, providerController.login);

module.exports = router;
