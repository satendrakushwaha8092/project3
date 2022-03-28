const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({

    title:  { 
        type: String, 
        required: true, 
        unique:true 
    },

    excerpt: { 
        type: String, 
        required: true
    },

    userId: { 
        required: true , 
        ref: " userModel",
        type:mongoose.Types.ObjectId,
    },

    ISBN: { 
        type: String, 
        required: true, 
        unique:true },

    category: {
         type: String, 
         required: true, 
        },

    subcategory: { 
        type: String, 
        required: true
    },
    
    reviews: {
        type: Number, 
        default:0
    },
    
    
    isDeleted: {
        type: Boolean, 
        default: false
    },

    // releasedAt:{
    //     type: Date,
    //     required:true,
    //     default: null
    // },
    
    



}, {timestamps:true})

module.exports=mongoose.model('createbook',bookSchema)