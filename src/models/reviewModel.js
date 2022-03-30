const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const reviewSchema = new mongoose.Schema({
    bookId :{
        required: true,
        type : ObjectId,
        ref : "bookModel"
    },
    reviewedBy:{
        type : String,
        required: true,
        default: "guest", 


    },
    reviewedAt:{
        type: Date, 
        default:Date.now,
         required:true
    },
    rating:{
        type:Number,
        required: true

    },
    review:{
        type: String,

    },
    isDeleted: {
        type : Boolean,
        default: false
    },
    deletedAt: {type: Date },

}, {timestamps:true})



module.exports = mongoose.model('review', reviewSchema)