const router = require("express").Router();
const authController = require('../controller/authController')
const guest = require('../controller/middleware/guest')
 


router.get('/login', guest,authController().login);
router.post('/login', authController().postLogin);

router.get('/register', guest,authController().register);
router.post('/register', authController().postregister);

router.post('/logout', authController().logout);


module.exports=router