const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({

    title:  { type: String, required: true, unique:true },

    excerpt: { type: String, required: true},

    userId: { required: true , type: ObjectId,
        ref: " userModel"},

    ISBN: { type: String, required: true, unique:true },

    category: { type: String, required: true, },

    subcategory: { type: String, required: true},
    
    reviews: {type: Number, default:0},
    
    deletedAt: {Date, default:Date.now}, 
    
    isDeleted: {type: Boolean, default: false},
    
    releasedAt: {},



}, {timestamps:true})