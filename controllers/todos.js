const { all } = require("express/lib/application");
const Todo = require("../models/todos");
const User = require("../models/users");

module.exports.todos = async(req,res,next) =>{
    try{
        const user = await User.findById(req.params.id)
        const todo = await Todo.find({userTodo:user._id});
        res.render("todo/home",{user,todo});
    }
    catch(e){
        res.send(e)
    }
}

module.exports.addTodo = async(req,res,next) =>{
    try{
        const user = await User.findById(req.params.id);
        if(user){
            const todosId = await Todo.findOne({userTodo : user._id});
            if(todosId){
                todosId.todos.push(req.body.todos);
                await todosId.save();
                res.redirect(`/api/todos/${user._id}`)
                // console.log(todosId);
            }
            else{
                const todoList = new Todo(req.body)
                todoList.userTodo = user._id;
                await todoList.save();
                res.redirect(`/api/todos/${user._id}`)
                // console.log(todoList)
            }
        }else{
            return res.send("User not found")
        }  
         
    }
    catch(e){
        console.log(e);
        res.send("error")
    }
}