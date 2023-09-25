const { UserModel } = require("../models/userModel")
const bcrypt=require("bcrypt")

 const loginMiddleware=async (req,res,next)=>{
    const {email,password} = req.body
    try {
        const isUser = await UserModel.findOne({"email":email})
        if(!isUser){
            res.status(401).send({"msg":"user doesn't exist"})
        }else if(isUser){
            bcrypt.compare(password, isUser.password, (err, result)=> {
                // result == true
                if(err){
                    res.status(500).send({"error":"internal server error"})
                }else if(!result){
                    res.status(401).send({"msg":"Invalid Credentials"})
                }else{
                    next()
                }
            })
        }
    } catch (error) {
        res.status(500).send({"error":"internal server error"})
    }
}

module.exports = {loginMiddleware}

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZm9vYmFyIiwiaWF0IjoxNjk1NjQwOTMzLCJleHAiOjE2OTU2NTUzMzN9.NYvpYeSPP5ILnv8HDWRhg2FQVks8v2_pEE-T96mkiIA