const express = require("express");
const {AddClient,DisplayClient,EditClient,DeleteClient,AddExcelClientData,ClientIncome,ClientCount,ClientTransaction} = require("../service/client.service");



const router = express.Router();

router.post("/addclient", AddClient);
router.get("/displayclient",DisplayClient);
router.put("/updateclient/:id",EditClient);
router.delete("/deleteclient/:id",DeleteClient);
router.get("/clientincome",ClientIncome)
router.get("/clientcount",ClientCount)
router.post("/importclients",AddExcelClientData);
router.get("/clienttransaction",ClientTransaction);

module.exports = router;