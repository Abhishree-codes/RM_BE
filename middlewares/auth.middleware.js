const { BlacklistModel } = require("../models/blacklistModel")
const jwt = require("jsonwebtoken")

const authMiddleware = async (req,res,next)=>{
  console.log(req?.headers)
    const token = req?.headers?.authorization?.split(" ")[1]
    try {
        const isToken = await BlacklistModel.findOne({"token":token})
        if(isToken){
            res.status(401).send({"msg":"please login again"})
        }else{
            jwt.verify(token, 'masai', (err, decoded)=> {
              if(err){
                res.status(500).send({"error":"internal server error"})
              }else if(!decoded){
                res.status(500).send({"error":"invalid token"})
              }else{
                next()
              }
              });
              
              
        }
    } catch (error) {
        res.status(500).send({"error":"internal server error"})
    }
}
module.exports = {authMiddleware}