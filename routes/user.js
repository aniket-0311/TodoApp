const express = require("express");
const router = express.Router();

// Import Controllers
const {renderRegister, register,login,loginPage,auth} = require("../controllers/users")

router.route("/register")
    .get(renderRegister)
    .post(register);

router.route("/login")
    .get( loginPage)
    .post( login);




module.exports = router;