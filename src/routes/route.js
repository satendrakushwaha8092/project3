const express = require('express');
const router = express.Router();



const usercontroller = require("../controllers/usercontroller")
const bookController=require("../controllers/bookcontroller")






router.post("/register",usercontroller.userCreate)
router.post("/login", usercontroller.userLogin)


router.post("/books",bookController.bookCreate)
router.get("/bookss",bookController.getBook)
router.get("/books/:bookId",bookController.getBookbyId)
router.put("/books/:bookId",bookController.bookUpdate)
router.delete("/books/:bookId",bookController.deletebyid)


module.exports = router;