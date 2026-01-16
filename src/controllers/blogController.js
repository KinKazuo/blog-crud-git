const mongoose = require("mongoose");
const Blog = require("../models/Blog");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

exports.createBlog = async (req, res, next) => {
  try {
    const { title, body, author } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: "title and body are required" });
    }

    const blog = await Blog.create({ title, body, author });
    return res.status(201).json(blog);
  } catch (err) {
    return next(err);
  }
};

exports.getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json(blogs);
  } catch (err) {
    return next(err);
  }
};

exports.getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid blog id" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json(blog);
  } catch (err) {
    return next(err);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid blog id" });
    }

    const { title, body, author } = req.body;

    if (title === "" || body === "") {
      return res.status(400).json({ message: "title/body cannot be empty" });
    }

    const updated = await Blog.findByIdAndUpdate(
      id,
      { title, body, author },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json(updated);
  } catch (err) {
    return next(err);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid blog id" });
    }

    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({ message: "Deleted", id: deleted._id });
  } catch (err) {
    return next(err);
  }
};
