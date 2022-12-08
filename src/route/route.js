const express= require('express')
const router = express.Router();
const bitcoinController=require("../controllers/bitcoin")

router.get('/bitcoin', bitcoinController.getcrpto) 

module.exports = router