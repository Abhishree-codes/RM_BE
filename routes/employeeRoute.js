const express = require("express")
const { authMiddleware } = require("../middlewares/auth.middleware")
const { EmpModel } = require("../models/employeeModel")
const { UserModel } = require("../models/userModel")
const employeeRouter = express.Router()

employeeRouter.get("/",authMiddleware,async (req,res)=>{
    let pipeline = []
    let count = 0
    const {page,department,order,sort,firstname}= req.query
    try {
        let matchObject={}
        if(firstname){
            matchObject.firstname=firstname
        }
        if(department){
            matchObject.department=department
        }
        if(sort){
            pipeline.push({$sort:{salary:order==="asc"?1:-1}})
        }
    
        
        pipeline.push({$match:matchObject})
        const getCount = await EmpModel.aggregate(pipeline)
        console.log(getCount.length,"length")
        let current = page||1
      
        pipeline.push({$skip:(current-1)*5},{$limit:5})
    
      const employees =  await EmpModel.aggregate(pipeline)
   
      res.status(200).send({employees,"count":getCount.length})  
    } catch (error) {
        console.log(error)
        res.status(500).send({"error":"internal server error"})
    }
})
employeeRouter.post("/add",authMiddleware,async (req,res)=>{
    try {
        const newEmp = new EmpModel(req.body)
      const sendEmp =  await newEmp.save()
        res.send({"msg":"employee added","employee":sendEmp})
    } catch (error) {
        res.status(500).send({"error":"internal server error"})
    }
})
employeeRouter.patch("/update/:id",authMiddleware,async(req,res)=>{
    const {id} = req.params
    try {
        await EmpModel.findByIdAndUpdate({_id:id},req.body) 
        res.status(200).send({"msg":"updated"})
    } catch (error) {
        res.status(500).send({"error":"internal server error"})   
    }
})
employeeRouter.delete("/delete/:id",authMiddleware,async (req,res)=>{
    const {id} = req.params
    try {
        await EmpModel.findByIdAndDelete({_id:id}) 
        res.status(200).send({"msg":"deleted"})
    } catch (error) {
        res.status(500).send({"error":"internal server error"})   
    }
})
module.exports ={employeeRouter}