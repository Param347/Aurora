const express = require("express");

const {
    createUser
} = require("../controllers/userController");


const router = express.Router();


// =====================================================
// USER SIGNUP
// =====================================================

router.post(
    "/signup",
    createUser
);


module.exports = router;