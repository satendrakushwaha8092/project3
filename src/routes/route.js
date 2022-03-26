const express = require('express');
const router = express.Router();



const usercontroller = require("../controllers/usercontroller")


router.get("/test-me", function(req,res){
    res.send("My api")

})



router.post("/register",usercontroller.userCreate)
router.post("/loginuser", usercontroller.userLogin)


module.exports = router;