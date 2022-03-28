const express = require('express');
const router = express.Router();



const usercontroller = require("../controllers/usercontroller")
const bookController=require("../controllers/bookcontroller")


router.get("/test-me", function(req,res){
    res.send("My api")

})



router.post("/register",usercontroller.userCreate)
router.post("/loginuser", usercontroller.userLogin)
router.post("/bookCreate",bookController.bookCreate)

module.exports = router;