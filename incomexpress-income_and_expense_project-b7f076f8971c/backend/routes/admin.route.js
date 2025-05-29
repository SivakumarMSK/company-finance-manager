const express = require("express");
const { AdminLogin } = require("../service/admin.service");


const router = express.Router();

router.post("/login",AdminLogin);

module.exports = router;