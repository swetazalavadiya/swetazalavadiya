const userModel = require('../model/userModel')
const validator = require('../validator/validator')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
    try {
        let data = req.body
        let {Name, phoneNumber, password, age, pincode, aadhar, vaccinationStatus, vaccinationDate, admin,...rest} = data

        let obj = {}

        if (!validator.checkInput(data)) return res.status(400).send({ status: false, message: "Body cannot be empty, Please provide mandatory fields i.e. Name, phone, password, age, pincode, aadhar" });
        if (validator.checkInput(rest)) return res.status(400).send({ status: false, message: "Provide only Name, phoneNumber, password, age, pincode, aadhar." })

        if (!validator.isValidInput(Name)) return res.status(400).send({status: false, message: "Please Enter Name"})
        if (!validator.checkName(Name)) return res.status(400).send({status: false, message: "Name should be alphabet only"})
        obj.Name = Name

        if (!validator.isValidInput(phoneNumber)) return res.status(400).send({status: false, message: "Please Enter phoneNumber"})
        if (!validator.isValidMobileNumber(phoneNumber)) return res.status(400).send({status: false, message: "INVALID INPUT... Please provide a valid phone Number"})
        obj.phoneNumber = phoneNumber

        if (!validator.isValidInput(password)) return res.status(400).send({status: false, message: "Please Enter Password"})
        if (!validator.isValidpassword(password)) return res.status(400).send({status: false, message: "Invalid Password Format. password should be have minimum 8 character and max 15 character and must contains one number, one uppar alphabet, one lower alphabet and one special character"})
        obj.password = password

        if (typeof age == 'number'){
            if (age > 120 || age < 5) return res.status(400).send({status: false, message: "To register here age must be more than 5 and less than 120"})
            obj.age = age
        }else{
            return res.status(400).send({status: false, message: "Age should be only in number"})
        }
        
        if (typeof pincode == 'number'){
            if (!validator.isValidPin(pincode)) return res.status(400).send({status: false, message: "INVALID INPUT... please provide a valid pincode"})
            obj.pincode = pincode
        }else{
            return res.status(400).send({status: false, message: "Pincode should be only in number"})
        }
        if (!validator.isValidInput(aadhar)) return res.status(400).send({status: false, message: "Please enter aadhar"})
        if (!validator.isValidAadhar(aadhar)) return res.status(400).send({status: false, message: "INVALID INPUT... please enter a valid aadhar Number"})
        obj.aadhar = aadhar

        let isDuplicate = await userModel.findOne({$or: [{phoneNumber: phoneNumber}, {aadhar: aadhar}]})
        if (isDuplicate){
            if (isDuplicate.phoneNumber==phoneNumber) return res.status(400).send({status: false, message: `Given phoneNumber: ${phoneNumber} already exist`})
            if (isDuplicate.aadhar==aadhar) return res.status(400).send({status: false, message: `Given aadhar: ${aadhar} already exist`})
        }

        let userData = await userModel.create(obj)
        return res.status(201).send({status: true, message: "user Created successfully", data: userData})
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}


const loginUser = async (req, res) => {
    try {
        let data = req.body
        let {phoneNumber, password, ...rest} = data

        if (!validator.checkInput(data)) return res.status(400).send({ status: false, message: "Please provide phoneNumber and password to login" });
        if (validator.checkInput(rest)) return res.status(400).send({ status: false, message: "this field accepts only phoneNumber and password" }) 

        if (!validator.isValidInput(phoneNumber)) return res.status(400).send({ status: false, message: "Please enter phoneNumber" })
        if (!validator.isValidMobileNumber(phoneNumber)) return res.status(400).send({ status: false, message: "INVALID INPUT... please provide a valid phoneNumber" })

        if (!validator.isValidInput(password)) return res.status(400).send({ status: false, message: "Please enter password" })
        if (!validator.isValidpassword(password)) return res.status(400).send({status: false, message: "Invalid Password Format. password should be have minimum 8 character and max 15 character and must contains one number, one uppar alphabet, one lower alphabet and one special character"})

        let checkUser = await userModel.findOne({phoneNumber: phoneNumber, password: password})
        if (!checkUser) return res.status(400).send({ status: false, message: "Incorrect phoneNumber or Password"})

        let token = jwt.sign({Id : checkUser._id, category: 'User'}, 'shhh', {expiresIn: '1h'})
        if (!token) return res.status(400).send({ status: false, message: "something went wrong"})

        let obj = {Id : checkUser._id, token: token}
        return res.status(200).send({status: true, message: "login successfull", data: obj})


    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
} 



module.exports = {registerUser, loginUser}

