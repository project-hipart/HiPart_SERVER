var express = require('express');
var router = express.Router();

router.use("/list", require("./list"));
router.use("/detail", require("./detail"));



module.exports = router;