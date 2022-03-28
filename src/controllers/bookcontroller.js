const mongoose = require('mongoose');
const bookModel = require("../models/bookModel.js")

const isValidObjectId = function(objectId){
    return mongoose.Types.ObjectId.isValid(objectId)
}


const bookCreate= async function(req,res){
    try{
    let data=req.body

    if (Object.keys(data).length == 0) {
        res.status(400).send({ status: false, msg: "please provide some data" })
    }

    //const {title,excerpt,userId,ISBN,category,subcategory,reviews} =data

    let title = req.body.title
    if (!title){
        return res.status(400).send({ status: false, msg: " title is required" })
    }

    let excerpt = req.body.excerpt
    if (!excerpt){
        return res.status(400).send({ status: false, msg: " Excerpt is required" })
    }

    let userId = req.body.userId
    if (!userId){
        return res.status(400).send({ status: false, msg: " userId is required" })
    }

    if(!isValidObjectId(userId)){
        res.status(400).send({status:false,message: `${userId} is not a valid user id`})
        return
    }

    let ISBN = req.body.ISBN
    if (!ISBN){
        return res.status(400).send({ status: false, msg: " ISBN is required" })
    }

    let category = req.body.category
    if (!category){
        return res.status(400).send({ status: false, msg: " category is required" })
    }

    let subcategory = req.body.subcategory
    if (!subcategory){
        return res.status(400).send({ status: false, msg: " subcategory is required" })
    }

    let reviews = req.body.reviews
    if (!reviews){
        return res.status(400).send({ status: false, msg: " reviews is required" })
    }

    // let releasedAt = req.body.releasedAt
    // if (!releasedAt){
    //     return res.status(400).send({ status: false, msg: " ReleasedAt is required" })
    // }

    let isbn=await bookModel.findOne({ISBN:data.ISBN})
    if(isbn)
     return res.status(400).send( {status: false,msg:"Number is issued already"})

    if(req.body.isDeleted==true){
        return res.status(400).send({ status: false, msg: " No data is deleted" })
    }

    let newbook = await bookModel.create(data)
    return res.status(201).send({ status: true, msg: newbook });
    }
catch (error) {
    console.log(error)
    return res.status(500).send({ status: false, msg: error.message })
}
    
}

module.exports.bookCreate=bookCreate