const { all } = require("express/lib/application");
const Todo = require("../models/todos");
const User = require("../models/users");

module.exports.todos = async(req,res,next) =>{
    try{
        const user = await User.findById(req.params.id)
        const todo = await Todo.find({userTodo:user._id});
        // console.log(req.query)
        res.render("todo/home",{user,todo});
        
        // res.send(todo)
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
                var date = new Date(req.body.date);  // dateStr you get from mongodb
                var d = date.getDate();
                var m = date.getMonth()+1;
                let y = date.getFullYear()
                const formattedDate = d + "-" + m + "-" + y;
                
                let obj = {}
                obj['todo_name'] = req.body.todo_name
                obj['date'] = formattedDate;
                obj['category'] = req.body.category;
                todosId.todos.push(obj);
                await todosId.save();
                res.redirect(`/api/todos/${user._id}`)
            }
            else{
                let obj = {}
                obj['todo_name'] = req.body.todo_name
                const todoList = new Todo(obj)
                console.log(todoList)
                todoList.userTodo = user._id;
                await todoList.save();
                res.redirect(`/api/todos/${user._id}`)
            }
        }else{
            return res.send("User not found")
        }       
    }
    catch(e){
        console.log(e);
        res.send("error")
    }
};

module.exports.deleteTodo = async(req, res) =>{
    try{
        const user = await User.findById(req.params.id);
        // console.log(user)
        const todoId = req.params.todoId;
        // console.log(req.params)
        if(user){
            const todosId = await Todo.findOne({userTodo:req.params.id});
            // console.log(todosId)
            if(todosId){
                // console.log( todosId.todos.id(todoId))
                todosId.todos.id(todoId).remove();
                todosId.save(function(err) {
                    if(err) return handleError(err);
                    console.log(`Todo removed of _id:${todoId}`)
                })   
                res.redirect(`/api/todos/${user._id}`)
            }
        }
    }
    catch(e){
        console.log(e);
        res.send("error")
    }
}