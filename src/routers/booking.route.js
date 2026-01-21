const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const { validateBooking, validateCommon } = require("../middlewares/validation.middleware");

router.post("/create", validateBooking.create, bookingController.createBooking);
router.get(/^\/(?<id>\d+)$/, bookingController.getBookingDetailsById);
router.get("/listing", [validateCommon.pagination], bookingController.getAllBookingList);
router.get("/pending", validateCommon.pagination, bookingController.getPendingBookings);

router.post("/assign-provider", bookingController.assignProviderToBooking);
router.post("/update-to-progress", bookingController.updateBookingToProgress);
router.post("/update-to-completed", bookingController.updateBookingToCompleted);
router.post("/cancel", bookingController.cancelBooking);
router.post("/reject", bookingController.rejectBooking);

module.exports = router;
