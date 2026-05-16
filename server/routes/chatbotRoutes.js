const express = require("express");
const { handleChatbotMessage } = require("../controllers/chatbotController");
const { optionalProtect } = require("../middleware/optionalAuthMiddleware");

const router = express.Router();

router.post("/", optionalProtect, handleChatbotMessage);

module.exports = router;