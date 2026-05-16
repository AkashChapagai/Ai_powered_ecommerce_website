const express = require("express");

const { getAdminAnalytics } = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/analytics", protect, admin, getAdminAnalytics);

module.exports = router;