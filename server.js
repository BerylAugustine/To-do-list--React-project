// Using Express
const express = require('express');
const mongoose = require('mongoose'); //mongoose - ODM
const cors = require('cors')

//creates an instance of express
const app = express();   //calling express module(gives a function) inside this app constant and keeping the object it delivers inside this app constant

//express middleware    // json()-this function gives a middlware wic is send to json
app.use(express.json())  //use method means we are gonna use a middleware(used to decode json data here)
app.use(cors())

//Sample in-memory storage for todo items
// let todos = [];

//Connecting Mongodb

mongoose.connect('mongodb://localhost:27017/mern-app')
    .then(() => {                                      //Promise is a proxy for a value not necessarily known when the promise is created
        console.log('DB Connected!')
    })
    .catch((err) => {
        console.log(err)
    })

//Creating a Schema       -with the help of this mongoose inserts data in a particular collection
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String,
    },
    description: {
        required: true,
        type: String,
    },
})

//Creating model
const todoModel = mongoose.model('Todo', todoSchema);


//Create a new todo item
app.post('/todos', async (req, res) => {               //post - create a new data
    const { title, description } = req.body       //we get all inputs we send  from body
    // const newTodo = {                          //create an object for creating a new todo list
    //     id: todos.length + 1,                      //must be unique
    //     title,
    //     description
    // };
    // todos.push(newTodo)
    // console.group(todos);
    try {
        const newTodo = new todoModel({ title, description })
        await newTodo.save();
        res.status(201).json(newTodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }


})


// Define a route - can access api service thro' URL
//Get all Items
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
    // get the data
    //get - a method creates get route, '/'-this uri denotes localhostPORT 
})                                    // what is to be done in the route is written inside the call back function

//Update a todo item
app.put('/todos/:id', async (req, res) => {

    try {
        const { title, description } = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        )
        if (!updatedTodo) {
            return res.status(404).json({ message: "Message not found" })
        }
        res.json(updatedTodo)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }

})

//Delete todo item
app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end()
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }

})

//Start a Server     - to start this app as a server program
const port = 8000;
app.listen(port, () => {     //listen() in Express is like telling your app to start listening for visitors on a specific address and port
    console.log("Server is listening to port", +port)
})