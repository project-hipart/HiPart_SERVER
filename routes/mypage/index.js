var express = require('express');
var router = express.Router();

router.use("/question", require("./question"));
router.use("/modify", require("./modify"));
router.use("/info", require("./info"));

module.exports = router;