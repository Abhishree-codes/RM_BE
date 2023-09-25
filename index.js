const express = require("express")
const app = express()
const cors = require("cors")
const { connection } = require("./db")
const bcrypt = require("bcrypt")
const { UserModel } = require("./models/userModel")
const { loginMiddleware } = require("./middlewares/login.middleware")
const jwt = require("jsonwebtoken")
const { employeeRouter } = require("./routes/employeeRoute")

app.use(cors())
app.use(express.json())
app.use("/employees",employeeRouter)

app.get("/",(req,res)=>{
    res.send("employee management api")
})

app.post("/signup",async (req,res)=>{
    const {email,password} = req.body
    try {
        bcrypt.hash(password, 5, async (err, hash)=> {
            // Store hash in your password DB.
            if(err){
                res.status(500).send({"error":"internal server error"})
            }else if(hash){
                const newUser = new UserModel({email,password:hash})
                await newUser.save()
                res.status(200).send({"msg":"user added"})
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({"error":"internal server error"})
    }
})

app.post("/login",loginMiddleware,async (req,res)=>{
    try {
        const token = jwt.sign({
            data: 'foobar'
          }, 'masai', { expiresIn: '4h' });
          res.status(200).send({"token":token})
    } catch (error) {
        res.status(500).send({"error":"internal server error"})
    }
})

app.listen(8080,async ()=>{
    try {
        await connection
        console.log("running and connected to db")
    } catch (error) {
        console.log(error)
    }
})

