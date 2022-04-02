const mongoose = require("mongoose")
const reviewModel = require("../models/reviewModel.js")
const bookModel = require("../models/bookModel.js")
const numberRegrex = /\d+/

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}


const reviewCreate = async function (req, res) {
    try {
        const data = req.body;
        if (Object.entries(data).length == 0) {
            return res.status(400).send({ status: false, msg: "please provide some data" })
        }
        else {
            let bookId = req.body.bookId
            if (!bookId)
                return res.status(400).send({ status: false, msg: " please enter bookId" })


            if (!isValidObjectId(bookId)) {
                res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
                return
            }

            let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
            if (!book) {
                return res.status(401).send({ status: false, msg: "Book  not exists" })
            }
            // let reviewedAt = req.body.reviewedAt
            // if (!reviewedAt)
            // return res.status(400).send({ status: false, msg: " reviewAt time is required" })

            let rating = req.body.rating
            if (!rating)
                return res.status(400).send({ status: false, msg: " Please give ratings" })

            if (isValid(rating)) {
                if (!(!isNaN(Number(rating)) && numberRegrex.test(rating))) {
                    return res.status(400).send({ status: false, msg: "Rating should be valid" })
                }
            }

            if (!(data.rating > 0 && data.rating <= 5))
                return res.status(400).send({ status: false, msg: "Rating must be between 1 to 5" })

        }
        let savedReview = await reviewModel.create(data)
        // book.review=book.toObject()
        // await book.save()
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

        let bookId = req.params.bookId;
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: `${bookId} is not a valid book id` })
        }

        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, msg: "Book  not found" })
        }

        let reviewId = req.params.reviewId;
        if (!isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, msg: `${reviewId} is not a valid review id` })
        }

        let reviewExit = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!reviewExit) {
            return res.status(404).send({ status: false, msg: "review  not exists" })
        }

       // const result = book.toObject()
        data['reviewData'] = reviewExit

        let rating = req.body.rating
        if (isValid(rating)) {
            if (!(!isNaN(Number(rating)) && numberRegrex.test(rating))) {
                return res.status(400).send({ status: false, msg: "Rating should be valid" })
            }
        }
        if (!(data.rating > 0 && data.rating <= 5))
            return res.status(400).send({ status: false, msg: "Rating must be between 1 to 5" })


        let savedData = await reviewModel.findOneAndUpdate({ _id: reviewId },
            data, { updatedAt: new Date(), new: true })
        return res.status(200).send({ status: true, msg: savedData });
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error.message })
    }
}

const reviewDelete = async function (req, res) {
    try {

        
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: `${bookId} is not a valid book id` })
        }

        if (!isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, msg: `${reviewId} is not a valid review id` })
        }

        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, msg: "Book  not found" })
        }

        let review = await reviewModel.findOne({ _id: reviewId, bookId: bookId ,isDeleted: false })
        if (!review) {
            return res.status(404).send({ status: false, msg: "Review  not found" })
        }



        let deletedreview = await reviewModel.findOneAndUpdate({ _id: reviewId },
           {$set: { isDeleted: true, deletedAt: new Date() }});

            book.reviews=book.reviews ===0? 0:book.reviews - 1
            await book.save()
        return res.status(200).send({ status: true, msg: 'success', data: deletedreview });
    }

    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error.message })
    }
}


module.exports.reviewCreate = reviewCreate
module.exports.reviewUpdate = reviewUpdate
module.exports.reviewDelete = reviewDelete




