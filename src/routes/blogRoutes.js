const express = require("express");
const controller = require("../controllers/blogController");

const router = express.Router();

router.post("/blogs", controller.createBlog);
router.get("/blogs", controller.getBlogs);
router.get("/blogs/:id", controller.getBlogById);
router.put("/blogs/:id", controller.updateBlog);
router.delete("/blogs/:id", controller.deleteBlog);

module.exports = router;
