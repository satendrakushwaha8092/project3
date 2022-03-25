const userModel = require("../models/userModel.js")
const emailValidator = require('validator')

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
        
        else{
            let title = req.body.title
            if (!title)
                return res.status(400).send({ status: false, msg: " enter valuid title" })

            let name = req.body.name
            if (!name)
                return res.status(400).send({ status: false, msg: "enter valid name" })

            let phone = req.body.phone
            if (!phone)
                return res.status(400).send({ status: false, msg: "enter valid phone" })
                if (!(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(phone))) {
                    res.status(400).send({status : false , msg : " enter valid no."})
                    return
                }
            

            let validphone = await userModel.findOne({phone})
            if (validphone) {
                return res.status(401).send({ status : false, msg :"phone no. is already exist"})
            }

            let email = req.body.email
            if (!email)
                return res.status(400).send({ status: false, msg: "please provide email" })

            let validemail = await userModel.findOne({email})
            if (validemail) {
                return res.status(401).send({ status : false, msg :"email id is already exist"})
            }
            

            let password = req.body.password
            if (!password)
                return res.status(400).send({ status: false, msg: "please provide password" })

            let address = req.body.address
            if (!address)
                return res.status(400).send({ status: false, msg: "please provide address" })

            let savedData = await userModel.create(data)
            return res.status(201).send({ status: true, msg: savedData });

    }
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error.message })
    }
}
module.exports.userCreate = userCreate