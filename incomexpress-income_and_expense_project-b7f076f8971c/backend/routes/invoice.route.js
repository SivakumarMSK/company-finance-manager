const express = require('express');
const {GetInvoice} = require('../service/invoice.service');
const router = express.Router();
router.get("/getinvoice",GetInvoice);
module.exports = router;