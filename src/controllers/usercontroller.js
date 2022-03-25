const userModel = require("../models/userModel.js")
const emailValidator = require('validator')
const jwt = require("jsonwebtoken")

const userCreate = async function (req, res) {
    try {
        let data = req.body;
        const { email } = req.body
        if (Object.entries(data).length == 0) {
            res.status(400).send({ status: false, msg: "please provide some data" })
        }
        const isValidEmail = emailValidator.isEmail(email)
        if (!isValidEmail) {
            return res.status(400).send({ status: false, msg: " invalid email" })
        }
        
        if (!(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(phone))) {
            return res.status(400).send({ status: false, msg: " enter valid no." })

        }

        else {
            let title = req.body.title
            if (!title)
                return res.status(400).send({ status: false, msg: " enter valid title" })

            let name = req.body.name
            if (!name)
                return res.status(400).send({ status: false, msg: "enter valid name" })

            let phone = req.body.phone
            if (!phone)
                return res.status(400).send({ status: false, msg: "enter valid phone" })

            let email = req.body.email
            if (!email)
                return res.status(400).send({ status: false, msg: "please provide email" })

            let password = req.body.password
            if (!password)
                return res.status(400).send({ status: false, msg: "please provide password" })

            let address = req.body.address
            if (!address)
                return res.status(400).send({ status: false, msg: "please provide address" })

          
            let validphone = await userModel.findOne({ phone })
            if (validphone) {
                return res.status(401).send({ status: false, msg: "phone no. is already exist" })
            }

            let validemail = await userModel.findOne({ email })
            if (validemail) {
                return res.status(401).send({ status: false, msg: "email id is already exist" })
            }


            let savedData = await userModel.create(data)
            return res.status(201).send({ status: true, msg: savedData });

        }
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
             res.status(400).send({status:false,msg:"kindly pass Some Data"})
         }
         let username = req.body.email;
         let password = req.body.password;
         let user = await userModel.findOne({email: username, password: password});
         if(!user)
             return res.status(400).send({
                status : false,
                msg:"username or password are not matching",
             });
         
         let token = jwt.sign({
              userId: user._id,
              email :username
              
            },
            "project-3"
            );
            res.setHeader("y-api-key",token);
          res.status(201).send({status: true,msg:'sucess', data: token})
         
    }
    catch (err) {
       res.status(500).send({ Error: err.message })
    }
 }
module.exports.userCreate = userCreate
module.exports.userLogin = userLogin