const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    todos:[{
        // todo_id:{
        //     type:  mongoose.Types.ObjectId
        // },
        todo_name:{
            type:String,
            default:""
        },
        date:{
            type:String
        },
        category:{
            type:String,
            default:""
        }
    }],
    userTodo:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Todo",todoSchema);