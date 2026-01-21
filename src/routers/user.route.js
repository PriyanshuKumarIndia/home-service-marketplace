const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { validateUser } = require("../middlewares/validation.middleware");

router.post("/register", validateUser.register, userController.register);
router.post("/register/verify-otp", validateUser.verifyOtp, userController.verifyOtp);
router.get("/verified-users", userController.getVerifiedUsers);
router.post("/login", validateUser.login, userController.login);

module.exports = router;
