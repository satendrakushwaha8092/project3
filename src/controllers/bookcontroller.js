const mongoose = require('mongoose');
//const ObjectId = require("mongoose").Types.ObjectId;
const bookModel = require("../models/bookModel.js")
const jwt = require("jsonwebtoken");
const userModel = require('../models/userModel.js');
const reviewModel = require("../models/reviewModel.js")

const isValid=function(value){
    if(typeof value ==='undefined' || value === null) return false
    if(typeof value ==='string' && value.trim().length === 0) return false
    return true
} 

// const isValidObjectId = (objectId) => {
//     if (ObjectId.isValid(objectId)) {
//       return true;
//     } else return false;
//   };
  


const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidRequestBody = function(requestBody){
    return Object.keys(requestBody).length > 0
}


const bookCreate = async function (req, res) {
    try {
        let data = req.body;
        
        const { title, ISBN, userId } = req.body

        if (Object.entries(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please provide some data" })
        }

         else {
               let title = req.body.title
                if (!title)
                return res.status(400).send({ status: false, msg: " Title is required" })

                let validtitle = await bookModel.findOne({ title })
                if (validtitle) {
                    return res.status(401).send({ status: false, msg: " Title already exist" })
                }

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

            let user = await userModel.findOne({ _id: data.userId })
            if (!user) {
            return res.status(401).send({ status: false, message: 'User does not exit' })

            }

            let ISBN = req.body.ISBN
            if (!ISBN){
                return res.status(400).send({ status: false, msg: " ISBN is required" })
            }

            let isvalidISBN =   /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN)
            if(!isvalidISBN){
                return res.status(400).send({ status: false, msg: "please provide valid ISBN" })
            }

            let validISBN = await bookModel.findOne({ ISBN })
            if (validISBN) {
                return res.status(401).send({ status: false, msg: "ISBN already exist" })
            }

            let category = req.body.category
            if (!category)
               { return res.status(400).send({ status: false, msg: "Category is required" })}

            let subcategory = req.body.subcategory
            if (!subcategory)
               { return res.status(400).send({ status: false, msg: "subcategory is required" })}

            let releasedAt=req.body.releasedAt
            if(!releasedAt)
               { return res.status(400).send({status :false,msg :"Released date is required"})}

            if(!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(releasedAt)) {
               res.status(400).send({ status: false, message: ' \"YYYY-MM-DD\"  Date format Accepted ' })
                return  
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
        let queryParams = req.query
        let filterQuery= { isDeleted: false}

        if(isValidRequestBody(queryParams)){
            const {userId,category,subcategory} =queryParams

            if(isValid(userId) && isValidObjectId(userId)){
                filterQuery['userId']= userId
            }
            if(isValid(category)){
                filterQuery['category']= category.trim()
            }
            if(isValid(subcategory)){
                filterQuery['subcategory']= subcategory.trim()
            }
        }
        
        const filterByQuery = await bookModel.find(filterQuery).sort({title:1}).select("_id title excerpt userId category releasedAt reviews")
        if (filterByQuery.length == 0) {
            return res.status(404).send({ status: false, msg: "No book found" })
        }
        
        return res.status(201).send({ status: true, msg: "Book lists", data: filterByQuery })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}

const getBookbyId = async function (req, res) { 
    try {
        let bookId = req.params.bookId;
        if(!isValidObjectId(bookId)){
            return res.status(400).send({ status: false, msg: `${bookId} is Not a Valid book id`  })
        }

        let count=await reviewModel.find({ bookId: bookId,isDeleted:false }).count()
        const Book =await bookModel.findOneAndUpdate({ _id: bookId },{reviews:count},{new:true});
    
         if (!Book) {
             return res.status(404).send({ status: false, msg: "Book does not exit" })
         }
        

        let reviews=await reviewModel.find({ bookId: bookId,isDeleted:false })
        // let bookwithreview = JSON.parse(JSON.stringify(Book))
        // bookwithreview.reviewsData = [...reviews]
        let data=Book.toObject()
        data['reviewsData']=reviews
        return res.status(200).send({ status: true,message:'Books list', data:data })
    }

    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}
const bookUpdate = async function (req, res) {
    try {
        let data = req.body
        let bookId = req.params.bookId.trim();
        const userIdFromToken = req.userId
        
        
        if(!isValidObjectId(bookId)){
            res.status(400).send({status:false,message: `${bookId} is not a valid book id`})
            return
        }
        
         const book = await bookModel.findOne( { _id: bookId, isDeleted: false } )

        if(!book) {
            res.status(404).send({ status : false , message : "Book Not Found" } )
            return
        }

        if(book.userId.toString() !== userIdFromToken) {
            res.status(403).send( { status : false , message : 'Unauthorized access ! Owner Info dosent match' } )
            return
        }
        
        let bookData = req.body
        if (Object.keys(bookData).length == 0) {
            return res.status(400).send({ status: false, msg: "Please provide some data" })
        }

        let title = await bookModel.findOne({ title: bookData.title })
        if (title) return res.status(400).send({ status: false, message: "This title is already present try another" })
       
        let ISBN = await bookModel.findOne({ ISBN: bookData.ISBN })
        if (ISBN) return res.status(400).send({ status: false, message: "This ISBN is already present try another" })
        

        let updatedbook = await bookModel.findOneAndUpdate({ _id: bookId },bookData, { new: true })
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

        let userIdFromToken = req.userId

        if(!isValidObjectId(bookId)){
            res.status(400).send({status:false,message: `${bookId} is not a valid book id`})
            return
        }

        const book =await bookModel.findOne({_id:bookId,isDeleted:false})

        if(!book){
        res.status(404).send({status:false,message: `Book not found`})
        return
        }

        if(book.userId.toString() !==userIdFromToken){
            res.status(401).send({status:false,message: `Unauthorized access!Owner info doesn't match`})
            return
        }
        
        let deleteBooks = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });
         return  res.status(200).send({ status: true, msg: "book deleted", data: deleteBooks });
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
