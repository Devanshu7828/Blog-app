const router = require("express").Router();
const { get } = require("mongoose");
const Blog = require("../models/blogModel");

router.get("/blog/:id", async (req, res) => {
  const { id } = req.params;

  const getBlog = await Blog.findById({ _id: id });

  res.render("blog/particularBlog", { blog: getBlog });
});

router.get("/delete/:id", (req, res) => {
  const { id } = req.params;
  Blog.deleteOne({ _id: id })
    .then((result) => {
      console.log("Deleted Blog Sucessfully");
      res.redirect("/blog");
    })
    .catch((err) => {
      console.log("Unable to delted:- ", err);
    });
});

router.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getData = await Blog.findById({ _id: id });
    res.render("blog/editBlog", { blog: getData });
  } catch (err) {
    console.log("unable to edit for this id ", err);
  }
});

router.post("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const getData = await Blog.updateOne({ _id: id }, { title, content });
    res.redirect("/");
  } catch (err) {
    console.log("unable to edit for this id ", err);
  }
});

module.exports = router;
