const mongoose = require('mongoose');

const blogSchema = new  mongoose.Schema({
    
    title: {
        type: String,
        required:true
    },
    content: {
        type:String,
        required:true
    },
    postedAt: {
        type:String,
        default: new Date().toString()
    }

})

const blogModel = mongoose.model('Blog', blogSchema);
module.exports = blogModel;