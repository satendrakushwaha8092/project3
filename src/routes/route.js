const express = require('express');
const router = express.Router();



const usercontroller = require("../controllers/usercontroller")


router.get("/test-me", function(req,res){
    res.send("My api")

})



router.post("/createuser",usercontroller.userCreate)
router.post("/login",usercontroller.userLogin)


module.exports = router;