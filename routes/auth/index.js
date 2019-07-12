var express = require('express');
var router = express.Router();


router.use("/signin", require("./signin"));
router.use("/signup", require("./signup"));
router.use("/refresh", require("./refresh"));
router.use("/duplicated", require("./duplicated"));
router.use("/finder", require("./finder"));

module.exports = router;