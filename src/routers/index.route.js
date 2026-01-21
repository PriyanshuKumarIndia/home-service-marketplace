const express = require("express");
const router = express.Router();
const userRouter = require("./user.route");
const roleRouter = require("./role.route");
const serviceRouter = require("./service.route");
const providerRouter = require("./provider.route");
const bookingRouter = require("./booking.route");
const adminRouter = require("./admin.route");

router.use("/users", userRouter);
router.use("/roles", roleRouter);
router.use("/services", serviceRouter);
router.use("/providers", providerRouter);
router.use("/bookings", bookingRouter);
router.use("/admin", adminRouter);

module.exports = router;
