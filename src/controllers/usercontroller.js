const userModel = require("../models/userModel.js")
const emailValidator = require('validator')
const jwt = require("jsonwebtoken")

const isValidTitle=function(title){
    return ['Mr','Mrs','Miss'].indexOf(title) !==-1
}

const userCreate = async function (req, res) {
try {
    let data = req.body;
    const { email } = req.body
    //const { phone } = req.body

    if (Object.keys(data).length == 0) {
         return res.status(400).send({ status: false, msg: "please provide some data" })
    }
    
    let title = req.body.title
    if (!title){
        return res.status(400).send({ status: false, msg: " title is required" })
    }
    if(!isValidTitle(title)){
       return res.status(400).send({status:false,message:'Title should be Mr ,Mrs,Miss'})
     }    

    let name = req.body.name
    if (!name){
        return res.status(400).send({ status: false, msg: "Name is required" })
    }
     
    let trimname =name.trim()
    if(!(/^(\w+\s)*\w+$/.test(trimname))){
        return res.status(400).send({ status: false, msg: "Please give a valid name without space" })

    }

    let phone = req.body.phone
    if (!phone){
        return res.status(400).send({ status: false, msg: "Phone no is required" })
    }
    
    let validphone = await userModel.findOne({ phone })
    if (validphone) {
        return res.status(401).send({ status: false, msg: "phone no. is already exist" })
    }
    if (!(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(phone))) {
        return res.status(400).send({ status: false, msg: " enter valid  phone no." })
    }
    
    
    if(!email){
        return res.status(400).send({ status: false, msg: " email is required" })
    }

    let validemail = await userModel.findOne({ email })
    if (validemail) {
        return res.status(400).send({ status: false, msg: "email id is already exist" })
    }

    const isValidEmail = emailValidator.isEmail(email)
    if (!isValidEmail) {
         return res.status(400).send({ status: false, msg: " invalid email" })
    }

    let password = req.body.password
    if (!password){
        return res.status(400).send({ status: false, msg: "Password is required" })
    }  

    let isValidPass= /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/.test(password)
    if(!isValidPass){
        return res.status(400).send({ status: false, msg: "please provide valid password" })
    }

    let address = req.body.address
    if (!address){
         return res.status(400).send({ status: false, msg: "please provide address" })
    }


    let savedData = await userModel.create(data)
    return res.status(201).send({ status: true, msg: savedData });
    }
catch (error) {
    console.log(error)
    return res.status(500).send({ status: false, msg: error.message })
}
}



const userLogin = async function(req,res){
    try{
         let data =req.body;
         if(Object.keys(data).length==0){
             return  res.status(400).send({status:false,msg:"kindly pass Some Data"})
         }
         let username = req.body.email;
         let password = req.body.password;

         if(!username){
            return res.status(400).send({ status: false, msg: " Email is required" })
        }

        const isValidEmail = emailValidator.isEmail(username)
        if (!isValidEmail) {
         return res.status(400).send({ status: false, msg: " invalid email" })
    }

        
         if (!password){
        return res.status(400).send({ status: false, msg: "Password is required" })
         }

         let user = await userModel.findOne({email: username, password: password});
         if(!user)
             return res.status(401).send({
                status : false,
                msg:"username or password are not matching",
             });
         
         let token = jwt.sign({
              userId: user._id,
              email :username
              
            },'project3',{expiresIn:"1800s"}
            );
            res.header('y-api-key',token);
           return res.status(200).send({status: true,msg:'sucess', data: {token}})
         
    }
    catch (err) {
       res.status(500).send({ Error: err.message })
    }
}

module.exports.userCreate = userCreate
module.exports.userLogin = userLogin