const router = require("express").Router();
const Blog = require("../models/blogModel");

router.get("/blog", async (req, res) => {
  const allBlogs = await Blog.find();
  res.render("blog/main", { blogs: allBlogs });
});

module.exports = router;
