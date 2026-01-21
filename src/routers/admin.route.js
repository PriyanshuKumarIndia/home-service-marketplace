const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { authenticate, authenticateAdmin } = require("../middlewares/auth.middleware");

router.post("/login", adminController.login);

router.get("/bookings", authenticate, authenticateAdmin, adminController.getAllBookings);

router.get("/bookings/stats", authenticate, authenticateAdmin, adminController.getBookingStats);

router.get("/bookings/:id/logs", authenticate, authenticateAdmin, adminController.getBookingLogs);

router.put("/bookings/:id/status", authenticate, authenticateAdmin, adminController.forceUpdateBookingStatus);

router.post("/bookings/assign-provider", authenticate, authenticateAdmin, adminController.assignProvider);

router.put("/bookings/:id/cancel", authenticate, authenticateAdmin, adminController.cancelBooking);

router.delete("/bookings/:id", authenticate, authenticateAdmin, adminController.deleteBooking);

// Bulk update bookings
router.put("/bookings/bulk-update", authenticate, authenticateAdmin, adminController.bulkUpdateBookings);

module.exports = router;