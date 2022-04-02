
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


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
        type: ObjectId,
        ref: "userModel"
    },

    ISBN: { 
        type: String, 
        required: true, 
        unique:true 
    },

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
        required: true,
        default:0
    },
    
    
    
    isDeleted: {
        type: Boolean, 
        default: false
    },

    deletedAt: {type: Date }, 
    
    releasedAt: {
        type: Date, 
        
         required:true
        }, 
    



}, {timestamps:true})


module.exports=mongoose.model('createbook',bookSchema)