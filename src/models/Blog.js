const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    body: { type: String, required: [true, "Body is required"], trim: true },
    author: { type: String, default: "Anonymous", trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
