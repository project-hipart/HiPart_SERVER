var express = require('express');
var router = express.Router();

router.use("/list", require("./list"));
router.use("/click", require("./click"));



module.exports = router;