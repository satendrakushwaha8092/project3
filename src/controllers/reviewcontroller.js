const mongoose = require("mongoose")
const reviewModel = require("../models/reviewModel.js")
const bookModel = require("../models/bookModel.js")


const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const reviewCreate = async function (req, res) {
    try {
        const data = req.body;
        if (Object.entries(data).length == 0) {
            return res.status(400).send({ status: false, msg: "please provide some data" })
        }
        else {
            let bookId = req.body.bookId
            let bookId1 = req.params.bookId
            if (!bookId)
                return res.status(400).send({ status: false, msg: " please enter bookId" })
                
    
            if (!isValidObjectId(bookId)) {
            res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
            return
             }

             if (!isValidObjectId(bookId1)) {
                res.status(400).send({ status: false, message: `${bookId1} is not a valid book id in params` })
                return
                 }

            let booksId = await bookModel.findOne({ _id: bookId })
            if (!booksId) {
                return res.status(401).send({ status: false, msg: "Book id not exists" })
            }
            
            // let reviewedAt = req.body.reviewedAt
            // if (!reviewedAt)
            // return res.status(400).send({ status: false, msg: " reviewAt time is required" })

            let rating = req.body.rating
            if (!rating)
                return res.status(400).send({ status: false, msg: " please give ratings" })

          if(!(data.rating>0 && data.rating<=5))
           return res.status(400).send({ status: false, msg: "rating is not valid" })
            
        }
        let savedReview = await reviewModel.create(data)
        return res.status(201).send({ status: true, msg: savedReview });
    }


    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error.message })
    }
}

const reviewUpdate = async function (req, res) {
    try {
        let data = req.body;
        if (Object.entries(data).length == 0) {
            return res.status(400).send({ status: false, msg: "please provide some data" })
        }
        
        if (!(await bookModel.findOne({_id:req.params.bookId,isDeleted: false }))) 
            return res.status(400).send({ status: false, msg: "book is not present" })

        if (!(await reviewModel.findOne({_id:req.params.reviewId,isDeleted: false }))) 
            return res.status(400).send({ status: false, msg: "review is not present" })

        if(!(data.rating>0 && data.rating<=5))
         return res.status(400).send({ status: false, msg: "rating is not valid" })
           

        let savedData = await reviewModel.findOneAndUpdate({ _id: req.params.reviewId }, 
        data,{ updatedAt:new Date(),new: true })
        return res.status(200).send({ status: true, msg: savedData });
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error.message })
    }
}

const reviewDelete = async function (req, res) {
    try {
        
        if (!(await bookModel.findOne({_id:req.params.bookId, isDeleted: false }))) 
           return res.status(400).send({ status: false, msg: "book is not present" })

        if (!(await reviewModel.findOne({_id:req.params.reviewId,isDeleted: false }))) 
           return res.status(400).send({ status: false, msg: "review is not present" })


        let deletedreview = await reviewModel.findOneAndUpdate({ _id: req.params.reviewId}, 
           { isDeleted:true, deletedAt:new Date()}, { new: true });
           return res.status(200).send({ status: true, msg:'success', data: deletedreview });
    }

    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error.message })
    }
}


module.exports.reviewCreate = reviewCreate
module.exports.reviewUpdate=reviewUpdate
module.exports.reviewDelete = reviewDelete