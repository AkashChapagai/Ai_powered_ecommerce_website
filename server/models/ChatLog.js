const mongoose = require("mongoose");

const chatLogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    response: {
      type: String,
      required: true,
    },

    intent: {
      type: String,
      default: "general",
    },

    matchedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ChatLog = mongoose.model("ChatLog", chatLogSchema);

module.exports = ChatLog;