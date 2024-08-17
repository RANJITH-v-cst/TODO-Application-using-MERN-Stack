const express=require('express')
const app=express()
const mongoose=require('mongoose')
const cors =require('cors')
app.use(express.json())
app.use(cors())

//mongodb connection
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(()=>{
    console.log('DB Connected!')
}).catch((error)=>{
    console.log(error)
})

//create schema
const todoSchema=new mongoose.Schema({
    title: {
        required:true,
        type:String
    },
    description:String
})

//create model
const todoModel=mongoose.model('Todo',todoSchema)

//create new todo in database
app.post('/todos',(req,res)=>{
   const{title,description}=req.body;
   try{const newTodo=new todoModel({title,description})
   res.status(201).json(newTodo)
   newTodo.save();}
   catch(error){
  console.log(500).json({message:error.message})
   }
})

//get all todos in database
app.get('/todos',async(req,res)=>{
    try{
      const todos =await todoModel.find();
       res.json(todos)
    } catch(error){
        console.log(error)
        res.status(500).json({message:error.message})
    }
    
})

//update todo in database
app.put("/todos/:id",async(req,res)=>{
    try{
        const{title,description}=req.body;
        const id=req.params.id ;
        const updatedtodo=await todoModel.findByIdAndUpdate(
            id,
            {title,description}
        ) 
        if(!updatedtodo){
            return res.status(400).json({message:"todo not found"})
        } 
        res.json(updatedtodo);
    }catch(error){
        console.log(error)
        res.status(500).json({message:error.message})
    }
    
})

//delete todo in database
app.delete('/todos/:id',async (req,res)=>{
    try{
    const id=req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
    }catch(error){
        console.log(error)
        res.status(500).json({message:error.message})
    }
})

 
//server start in port
const port=8000
 app.listen(port,()=>{
    console.log("server is listening to port "+port)
 })