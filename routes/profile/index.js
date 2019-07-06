var express = require('express');
var router = express.Router();

router.use("/list", require("./list"));
router.use("/detail", require("./detail"));
router.use("/recommend", require("./recommend"));


module.exports = router;