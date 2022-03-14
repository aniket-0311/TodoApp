const express = require("express");
const router = express.Router({ mergeParams: true });

const{todos,addTodo,deleteTodo} = require("../controllers/todos")
const{auth} = require("../controllers/users");

router.route("/")
    .get(
        auth,
        todos)
    .post(
        auth,
        addTodo)

    
router.route("/:todoId")
    .get(deleteTodo)



module.exports = router;