const router = require('express').Router();
const Blog = require("../models/blogModel"); 

router.get('/', async (req, res) => {
    const allBlogs = await Blog.find();
    
    res.render('blog/home',{blogs:allBlogs})
    
})

module.exports = router;