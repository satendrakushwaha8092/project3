const mongoose = require('mongoose');
const bookModel = require("../models/bookModel.js")
const jwt = require("jsonwebtoken");
const userModel = require('../models/userModel.js');
const reviewModel = require("../models/reviewModel.js")

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

// const isValidRequestBody = function(reqBody){
//     return Object.keys(reqBody).length >0
// }



const bookCreate = async function (req, res) {
    try {
        let data = req.body;
        
        const { title, ISBN, userId } = req.body

        if (Object.entries(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please provide some data" })
        }



        //  if(!isValidRequestBody(data)){
        //     res.status(400).send({ status: false, message: "please provide some data"})
        //     return
        //  }

         else {
            let title = req.body.title
            if (!title)
                return res.status(400).send({ status: false, msg: " Title is required" })

                let trimname =title.trim()
                if(!(/^(\w+\s)*\w+$/.test(trimname))){
                    return res.status(400).send({ status: false, msg: "Please give a valid title without space" })
            
                }

            let excerpt = req.body.excerpt
            if (!excerpt)
                return res.status(400).send({ status: false, msg: "Excerpt is required" })

            let userId = req.body.userId
            if (!userId)
                return res.status(400).send({ status: false, msg: "userId is required" })

            if (!isValidObjectId(userId)) {
                res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
                return
            }

            let ISBN = req.body.ISBN
            if (!ISBN){
                return res.status(400).send({ status: false, msg: " ISBN is required" })
            }

            let isvalidISBN =   /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN)
            if(!isvalidISBN){
                return res.status(400).send({ status: false, msg: "please provide valid ISBN" })
            }

            let category = req.body.category
            if (!category)
               { return res.status(400).send({ status: false, msg: "Category is required" })}

            let subcategory = req.body.subcategory
            if (!subcategory)
               { return res.status(400).send({ status: false, msg: "subcategory is required" })}

            // let reviews = req.body.reviews
            // if (!reviews)
            //    { return res.status(400).send({ status: false, msg: "Reviews is required" })}


            let validtitle = await bookModel.findOne({ title })
            if (validtitle) {
                return res.status(401).send({ status: false, msg: " Title already exist" })
            }

            let validISBN = await bookModel.findOne({ ISBN })
            if (validISBN) {
                return res.status(401).send({ status: false, msg: "ISBN already exist" })
            }

            
            let releasedAt=req.body.releasedAt
            if(!releasedAt)
               { return res.status(400).send({status :false,msg :"Released date is required"})}

            if(!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(releasedAt)) {
               res.status(400).send({ status: false, message: ' \"YYYY-MM-DD\"  Date format Accepted ' })
                return  
            } 

        let user = await userModel.findOne({ _id: data.userId })
        if (!user) {
            return res.status(401).send({ status: false, message: 'User does not exit' })

        }

        let savedData = await bookModel.create( data )
        return res.status(201).send({ status: true, msg: savedData });
        }
    
    }
    catch (error) {
    console.log(error)
    return res.status(500).send({ status: false, msg: error.message })
}
}

const getBook = async function (req, res) {
    try {
        let query = req.query
        let filter = {
            isDeleted: false,

            ...query
        }

        const filterByQuery = await bookModel.find(filter).sort({title:1}).select({ ISBN: 0, isDeleted: 0,subcategory:0, deletedAt: 0, createdAt: 0, updatedAt: 0 })
        if (filterByQuery.length == 0) {
            return res.status(404).send({ status: false, msg: "No book found" })
        }
        console.log("Data fetched successfully")
        return res.status(201).send({ status: true, msg: "Book lists", data: filterByQuery })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}

const getBookbyId = async function (req, res) { //get books data by body params
    try {
        let bookId = req.params.bookId;
        if(!isValidObjectId(bookId)){
            return res.status(404).send({ status: false, msg: "Please provide a valid bookid" })
        }

        let count=await reviewModel.find({ bookId: bookId,isDeleted:false }).count()
        const Book =await bookModel.findOneAndUpdate({ _id: bookId },{reviews:count},{new:true});
    
         if (!Book) {
             return res.status(404).send({ status: false, msg: "No book found" })
         }
        

        let reviews=await reviewModel.find({ bookId: bookId,isDeleted:false })
        let bookwithreview = JSON.parse(JSON.stringify(Book))
        bookwithreview.reviewsData = [...reviews]
        return res.status(200).send({ status: true,message:'Books list', data:bookwithreview })
    }

    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}
const bookUpdate = async function (req, res) {
    try {
        let data = req.params.bookId
        
        let book = await bookModel.findById({ _id: data, isDeleted: false })
        if (!book) return res.status(404).send({ status: false, message: "Data is not available" })

        let bookData = req.body
        if (Object.keys(bookData).length == 0) {
            return res.status(400).send({ status: false, msg: "Please provide some data" })
        }

        let title = await bookModel.findOne({ title: bookData.title })
        if (title) return res.status(400).send({ status: false, message: "This title is already present try another" })
       
        let ISBN = await bookModel.findOne({ ISBN: bookData.ISBN })
        if (ISBN) return res.status(400).send({ status: false, message: "This ISBN is already present try another" })
        

        let updatedbook = await bookModel.findOneAndUpdate({ _id: data }, bookData, { new: true })
        res.status(200).send({ status: true, message: 'success', data: updatedbook });

    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error.message })
    }
}


const deletebyid = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId) {
            return res.status(400).send({ status: false, msg: "bookId is required" })
        }


        let bookDetails = await bookModel.findOne({ _id: bookId }, { isDeleted: false })
        if (!bookDetails) {
             return res.status(404).send({ status: false, msg: "book does not exist" })
        } 
        // if (!isValidObjectId(bookId)) {
        //     res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
        //     return
        // }
        else {
            let deleteBooks = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });
            return  res.status(200).send({ status: true, msg: "book deleted", data: deleteBooks });
            console.log(bookDetails)
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.bookCreate = bookCreate
module.exports.getBook = getBook
module.exports.getBookbyId = getBookbyId
module.exports.bookUpdate = bookUpdate
module.exports.deletebyid = deletebyid
