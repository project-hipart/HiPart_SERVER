var express = require('express');
var router = express.Router();

router.use("/question", require("./question"));
router.use("/modify", require("./modify"));
router.use("/info", require("./info"));
router.use("/pick", require("./pick"));
router.use("/hifive", require("./hifive"));
module.exports = router;