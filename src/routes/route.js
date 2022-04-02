const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken")



const usercontroller = require("../controllers/usercontroller")
const bookController=require("../controllers/bookcontroller")
const reviewController=require("../controllers/reviewcontroller")
const auth = require("../middleware/auth")





//****************** USER API *************************************

router.post("/register",usercontroller.userCreate)

router.post("/login", usercontroller.userLogin)

//***************** BOOK API **************************************

router.post("/books", auth.authentication, bookController.bookCreate)

router.get("/books", auth.authentication, bookController.getBook)

router.get("/books/:bookId", auth.authentication, bookController.getBookbyId)

router.put("/books/:bookId", auth.authentication, bookController.bookUpdate)

router.delete("/books/:bookId", auth.authentication, bookController.deletebyid)

//***************** REVIEW API ************************************

router.post("/books/:bookId/review",reviewController.reviewCreate)

router.put("/books/:bookId/review/:reviewId",reviewController.reviewUpdate)

router.delete("/books/:bookId/review/:reviewId",reviewController.reviewDelete)



module.exports = router;